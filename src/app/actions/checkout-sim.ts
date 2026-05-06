"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, orders, orderItems, isDbConfigured } from "@/db";
import { sendOrderConfirmation } from "@/lib/email";

export async function simulatePayAction(formData: FormData): Promise<void> {
  if (!isDbConfigured) redirect("/");
  const orderId = String(formData.get("orderId") ?? "");
  const result = String(formData.get("result") ?? "rejected");

  if (!orderId) redirect("/");

  if (result === "approved") {
    const fakePaymentId = `SIM-${Date.now().toString(36).toUpperCase()}`;
    await db
      .update(orders)
      .set({
        status: "paid",
        mpPaymentId: fakePaymentId,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    // email best-effort: si Resend no está configurado, ignora silenciosamente
    try {
      const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));
      if (order) {
        await sendOrderConfirmation(order, items);
      }
    } catch {
      // swallow
    }

    redirect(`/checkout/exito?orderId=${orderId}`);
  } else {
    await db
      .update(orders)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(orders.id, orderId));
    redirect(`/checkout/error?orderId=${orderId}`);
  }
}
