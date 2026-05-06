import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { db, orders, orderItems, isDbConfigured } from "@/db";
import { formatArs } from "@/lib/format";
import { CARRIER_LABEL } from "@/lib/shipping";
import { simulatePayAction } from "@/app/actions/checkout-sim";
import { verifyOrderToken } from "@/lib/order-token";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pago simulado · Bosque" };

type Props = { searchParams: Promise<{ orderId?: string; token?: string }> };

export default async function SimulatedPaymentPage({ searchParams }: Props) {
  if (!isDbConfigured) redirect("/");
  const { orderId, token } = await searchParams;
  if (!orderId || !token) notFound();
  if (!verifyOrderToken(orderId, token)) notFound();

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return (
    <>
      <SiteHeader />
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-12">
          <p className="eyebrow">Pago simulado · Demo</p>
          <h1 className="mt-3 text-5xl sm:text-7xl leading-[0.85]">
            Esto sería Mercado Pago.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted">
            En el demo público no procesamos pagos reales. Hacé clic en{" "}
            <em>Confirmar pago</em> para simular un pago aprobado y ver el
            flow completo (orden registrada, email transaccional, vista en
            admin). El modo producción se activa con{" "}
            <code className="font-mono text-foreground">PAYMENT_MODE=production</code>.
          </p>
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="border border-border bg-background p-6">
              <p className="eyebrow">Orden #{order.id.slice(0, 8)}</p>
              <ul className="mt-6 divide-y divide-border">
                {items.map((it) => (
                  <li key={it.id} className="py-4 flex justify-between gap-4">
                    <div>
                      <p className="font-display text-xl uppercase leading-none">
                        {it.productName}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Cantidad {it.quantity} · {formatArs(Number(it.unitPriceArs))} c/u
                      </p>
                    </div>
                    <p className="font-mono text-sm whitespace-nowrap">
                      {formatArs(Number(it.subtotalArs))}
                    </p>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 pt-6 border-t border-border space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd>{formatArs(Number(order.subtotalArs))}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">
                    Envío · {CARRIER_LABEL[order.shippingCarrier as keyof typeof CARRIER_LABEL]}
                  </dt>
                  <dd>{formatArs(Number(order.shippingCostArs))}</dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-border text-base">
                  <dt>Total a pagar</dt>
                  <dd>{formatArs(Number(order.totalArs))}</dd>
                </div>
              </dl>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-border bg-background p-6 space-y-6">
              <p className="eyebrow">Datos de envío</p>
              <ul className="text-sm space-y-1">
                <li>{order.customerName}</li>
                <li className="text-muted">{order.customerEmail}</li>
                {order.customerPhone && (
                  <li className="text-muted">{order.customerPhone}</li>
                )}
              </ul>
              <ul className="text-sm space-y-1 pt-4 border-t border-border">
                <li>{order.shippingAddress}</li>
                <li>
                  {order.shippingCity}, {order.shippingProvince} (
                  {order.shippingPostal})
                </li>
              </ul>

              <form action={simulatePayAction} className="pt-4 border-t border-border space-y-3">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="token" value={token} />
                <button
                  type="submit"
                  name="result"
                  value="approved"
                  className="w-full bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
                >
                  Confirmar pago (simular aprobado)
                </button>
                <button
                  type="submit"
                  name="result"
                  value="rejected"
                  className="w-full border border-border px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:border-frutos-rojos hover:text-frutos-rojos transition-colors"
                >
                  Simular pago rechazado
                </button>
              </form>
              <p className="text-xs text-muted">
                Esta pantalla solo aparece en{" "}
                <code className="font-mono">PAYMENT_MODE=simulated</code>.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
