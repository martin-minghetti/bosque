"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { Preference } from "mercadopago";
import { db, orders, orderItems, isDbConfigured } from "@/db";
import { readCart, clearCart } from "@/lib/cart";
import { mpClient } from "@/lib/mp";
import {
  postalCodeToZone,
  getShippingRate,
  type ShippingCarrier,
} from "@/lib/shipping";
import { makeOrderToken } from "@/lib/order-token";
import { rateLimit, maybeCleanup } from "@/lib/rate-limit";

const checkoutSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email().max(180),
  customerPhone: z.string().max(40).optional().or(z.literal("")),
  shippingAddress: z.string().min(4).max(240),
  shippingCity: z.string().min(2).max(120),
  shippingProvince: z.string().min(2).max(80),
  shippingPostal: z
    .string()
    .min(4)
    .max(8)
    .regex(/^[A-Z]?\d{4}([A-Z]{3})?$/i, "Código postal AR inválido"),
  shippingCarrier: z.enum(["andreani", "correo", "oca"]),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type CheckoutResult = {
  ok: boolean;
  error?: string;
};

export async function createOrderAction(
  formData: FormData,
): Promise<CheckoutResult> {
  if (!isDbConfigured) {
    return { ok: false, error: "DATABASE_URL no configurada" };
  }

  // Rate limit: 10 checkouts por IP cada 5 min
  maybeCleanup();
  const h = await headers();
  const clientKey = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`checkout:${clientKey}`, 10, 5 * 60 * 1000);
  if (!rl.ok) {
    return { ok: false, error: "Demasiados intentos. Esperá unos minutos." };
  }

  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone") || "",
    shippingAddress: formData.get("shippingAddress"),
    shippingCity: formData.get("shippingCity"),
    shippingProvince: formData.get("shippingProvince"),
    shippingPostal: formData.get("shippingPostal"),
    shippingCarrier: formData.get("shippingCarrier"),
    notes: formData.get("notes") || "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }
  const data = parsed.data;

  const zone = postalCodeToZone(data.shippingPostal);
  if (!zone) {
    return { ok: false, error: "No pudimos derivar zona de envío del código postal" };
  }

  const cart = await readCart();
  if (cart.lines.length === 0) {
    return { ok: false, error: "El carrito está vacío" };
  }

  const rate = getShippingRate(zone, data.shippingCarrier as ShippingCarrier);

  const subtotal = cart.subtotalArs;
  const total = subtotal + rate.costArs;

  const paymentMode = process.env.PAYMENT_MODE === "production" ? "production" : "simulated";

  const [order] = await db
    .insert(orders)
    .values({
      cartSessionId: cart.sessionId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      customerPhone: data.customerPhone || null,
      shippingZone: zone,
      shippingCarrier: data.shippingCarrier,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingProvince: data.shippingProvince,
      shippingPostal: data.shippingPostal,
      shippingCostArs: String(rate.costArs),
      subtotalArs: String(subtotal),
      totalArs: String(total),
      status: "pending",
      paymentMode,
      notes: data.notes || null,
    })
    .returning({ id: orders.id });

  await db.insert(orderItems).values(
    cart.lines.map((l) => ({
      orderId: order.id,
      productSlug: l.productSlug,
      productName: l.product.name,
      quantity: l.quantity,
      unitPriceArs: String(l.unitPriceArs),
      subtotalArs: String(l.subtotalArs),
    })),
  );

  let initPoint: string;
  const viewToken = makeOrderToken(order.id);

  if (paymentMode === "simulated" || !mpClient) {
    initPoint = `/checkout/simulated?orderId=${order.id}&token=${viewToken}`;
  } else {
    const preference = await new Preference(mpClient).create({
      body: {
        items: cart.lines.map((l) => ({
          id: l.productSlug,
          title: l.product.name,
          quantity: l.quantity,
          unit_price: Number(l.unitPriceArs),
          currency_id: "ARS",
        })),
        shipments: {
          cost: rate.costArs,
          mode: "not_specified",
        },
        external_reference: order.id,
        payer: {
          name: data.customerName,
          email: data.customerEmail,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/exito?orderId=${order.id}&token=${viewToken}`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pendiente?orderId=${order.id}&token=${viewToken}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?orderId=${order.id}&token=${viewToken}`,
        },
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mp/webhook`,
      },
    });
    if (!preference.init_point) {
      return { ok: false, error: "No se pudo crear preferencia MP" };
    }
    await db
      .update(orders)
      .set({ mpPreferenceId: preference.id })
      .where(eqOrderId(order.id));
    initPoint = preference.init_point;
  }

  await clearCart();
  redirect(initPoint);
}

// helper local (drizzle eq importado dinámicamente para evitar
// duplicar import en archivo grande)
import { eq } from "drizzle-orm";
function eqOrderId(id: string) {
  return eq(orders.id, id);
}
