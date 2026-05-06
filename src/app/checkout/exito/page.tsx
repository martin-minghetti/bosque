import Link from "next/link";
import { eq } from "drizzle-orm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { db, orders, orderItems, isDbConfigured } from "@/db";
import { formatArs } from "@/lib/format";
import { CARRIER_LABEL } from "@/lib/shipping";
import { verifyOrderToken } from "@/lib/order-token";

export const dynamic = "force-dynamic";
export const metadata = { title: "Compra confirmada · Bosque" };

type Props = { searchParams: Promise<{ orderId?: string; token?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  if (!isDbConfigured) {
    return (
      <>
        <SiteHeader />
        <main className="bg-background py-32 text-center">
          <h1 className="text-5xl">Modo demo</h1>
          <p className="text-muted mt-4">DB no configurada.</p>
        </main>
        <SiteFooter />
      </>
    );
  }
  const { orderId, token } = await searchParams;

  // IDOR guard: solo el dueño con el token correcto puede ver la orden.
  const isAuthorized = orderId && token && verifyOrderToken(orderId, token);

  const [order] = isAuthorized
    ? await db.select().from(orders).where(eq(orders.id, orderId))
    : [];
  const items = isAuthorized && order
    ? await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))
    : [];

  return (
    <>
      <SiteHeader />
      <section className="bg-cacao text-background-cream">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 py-24 sm:py-32 text-center">
          <p className="eyebrow text-background-cream/60">Compra confirmada</p>
          <h1 className="mt-4 text-6xl sm:text-8xl leading-[0.85]">Gracias.</h1>
          {order ? (
            <p className="mt-6 text-base sm:text-lg text-background-cream/80 max-w-md mx-auto">
              Recibimos tu pago de{" "}
              <span className="font-mono">{formatArs(Number(order.totalArs))}</span>.
              Te enviamos un mail a {order.customerEmail} con el detalle. Despachamos
              en 24-48h con{" "}
              {
                CARRIER_LABEL[
                  order.shippingCarrier as keyof typeof CARRIER_LABEL
                ]
              }
              .
            </p>
          ) : (
            <p className="mt-6 text-base text-background-cream/70">
              Tu compra fue confirmada. Revisá tu mail para el detalle.
            </p>
          )}
        </div>
      </section>

      {order && items.length > 0 && (
        <section className="bg-background-cream">
          <div className="mx-auto max-w-3xl px-6 sm:px-10 py-16 grid gap-6">
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
                        × {it.quantity}
                      </p>
                    </div>
                    <p className="font-mono text-sm">
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
                  <dt className="text-muted">Envío</dt>
                  <dd>{formatArs(Number(order.shippingCostArs))}</dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-border text-base">
                  <dt>Total</dt>
                  <dd>{formatArs(Number(order.totalArs))}</dd>
                </div>
              </dl>
            </div>
            <Link
              href="/tienda"
              className="text-center bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded transition-all duration-500 ease-out hover:bg-cacao"
            >
              Volver a la tienda
            </Link>
          </div>
        </section>
      )}
      <SiteFooter />
    </>
  );
}
