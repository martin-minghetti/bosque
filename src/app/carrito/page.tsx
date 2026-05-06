import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { readCart } from "@/lib/cart";
import { isDbConfigured } from "@/db";
import { formatArs } from "@/lib/format";
import { setCartLineAction, clearCartAction } from "@/app/actions/cart";
import { ProductImage } from "@/components/ProductImage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Carrito · Bosque" };

export default async function CarritoPage() {
  const cart = await readCart();

  if (!isDbConfigured) {
    return (
      <>
        <SiteHeader />
        <section className="bg-background-warm">
          <div className="mx-auto max-w-3xl px-6 sm:px-10 py-24 sm:py-32 text-center">
            <p className="eyebrow">Modo demo</p>
            <h1 className="mt-4 text-5xl sm:text-7xl">Falta DB.</h1>
            <p className="mt-6 text-base text-muted">
              El carrito server-side requiere{" "}
              <code className="font-mono text-foreground">DATABASE_URL</code>{" "}
              configurada (Neon Postgres). Mientras tanto, la home y la tienda
              funcionan en modo lectura.
            </p>
            <Link
              href="/tienda"
              className="inline-flex mt-10 items-center gap-3 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
            >
              Volver a tienda
            </Link>
          </div>
        </section>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-12 sm:py-16">
          <p className="eyebrow">Tu carrito</p>
          <h1 className="mt-3 text-6xl sm:text-8xl leading-[0.85]">
            {cart.itemCount === 0
              ? "Vacío."
              : `${cart.itemCount} ${cart.itemCount === 1 ? "producto" : "productos"}.`}
          </h1>
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {cart.lines.length === 0 ? (
              <div className="border border-border p-10 text-center bg-background">
                <p className="text-muted">Tu carrito está vacío.</p>
                <Link
                  href="/tienda"
                  className="inline-flex mt-6 items-center gap-3 bg-foreground text-background-cream px-6 py-3 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
                >
                  Ver tienda
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border border border-border bg-background">
                {cart.lines.map((line) => (
                  <li
                    key={line.productSlug}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-5"
                  >
                    <Link
                      href={`/tienda/${line.productSlug}`}
                      className="block w-full sm:w-32 aspect-square shrink-0"
                      aria-label={line.product.name}
                    >
                      <ProductImage
                        product={line.product}
                        className="w-full h-full"
                        sizes="128px"
                      />
                    </Link>
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="eyebrow">{line.product.category}</p>
                          <Link
                            href={`/tienda/${line.productSlug}`}
                            className="font-display text-2xl uppercase leading-none mt-2 inline-block hover:text-cacao"
                          >
                            {line.product.shortName}
                          </Link>
                          <p className="mt-2 text-sm text-muted">
                            {line.product.weightG}g ·{" "}
                            {line.product.cocoaPercent
                              ? `${line.product.cocoaPercent}% cacao`
                              : line.product.originLabel}
                          </p>
                        </div>
                        <p className="font-mono text-base whitespace-nowrap">
                          {formatArs(line.subtotalArs)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-auto">
                        <form action={setCartLineAction} className="flex items-center gap-2">
                          <input type="hidden" name="slug" value={line.productSlug} />
                          <select
                            name="quantity"
                            defaultValue={String(line.quantity)}
                            className="border border-border bg-transparent py-2 px-3 font-mono text-sm focus:outline-none"
                          >
                            {Array.from(
                              { length: Math.min(line.product.stock, 10) },
                              (_, i) => i + 1,
                            ).map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="text-[0.78rem] uppercase kerning-expanded text-muted hover:text-foreground"
                          >
                            Actualizar
                          </button>
                        </form>
                        <form action={setCartLineAction}>
                          <input type="hidden" name="slug" value={line.productSlug} />
                          <input type="hidden" name="quantity" value="0" />
                          <button
                            type="submit"
                            className="text-[0.78rem] uppercase kerning-expanded text-muted hover:text-frutos-rojos"
                          >
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-background border border-border p-6 sticky top-32">
              <p className="eyebrow">Resumen</p>
              <dl className="mt-6 space-y-3 text-sm font-mono">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd>{formatArs(cart.subtotalArs)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Envío</dt>
                  <dd className="text-muted">A calcular en checkout</dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-border text-base">
                  <dt>Total parcial</dt>
                  <dd>{formatArs(cart.subtotalArs)}</dd>
                </div>
              </dl>
              <Link
                href={cart.lines.length > 0 ? "/checkout" : "/tienda"}
                className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
              >
                {cart.lines.length > 0 ? "Continuar a checkout" : "Ver tienda"}
              </Link>
              {cart.lines.length > 0 && (
                <form action={clearCartAction} className="mt-4">
                  <button
                    type="submit"
                    className="w-full text-[0.78rem] uppercase kerning-expanded text-muted hover:text-frutos-rojos"
                  >
                    Vaciar carrito
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
