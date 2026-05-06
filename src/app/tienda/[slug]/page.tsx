import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { findProduct, PRODUCTS, activeProducts } from "@/data/products";
import { formatArs, formatBatch } from "@/lib/format";
import { addToCartAndRedirect } from "@/app/actions/cart";
import { ProductImage } from "@/components/ProductImage";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) return { title: "Producto · Bosque" };
  return {
    title: `${p.name} · Bosque`,
    description: p.description,
  };
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product || !product.active) notFound();

  const related = activeProducts()
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <SiteHeader />

      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-4 text-[0.78rem] uppercase kerning-expanded flex items-center gap-2 text-muted">
          <Link href="/tienda" className="hover:text-foreground">
            Tienda
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/tienda?cat=${product.category}`}
            className="hover:text-foreground"
          >
            {product.category}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground">{product.shortName}</span>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* packshot */}
          <div className="lg:col-span-7">
            <ProductImage
              product={product}
              className="aspect-square w-full"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>

          {/* ficha */}
          <div className="lg:col-span-5">
            <p className="eyebrow">
              {product.category} · Lote {String(product.batchNumber).padStart(3, "0")}
            </p>
            <h1 className="mt-3 text-5xl sm:text-6xl lg:text-7xl leading-[0.85]">
              {product.name}
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted">
              {product.longDescription}
            </p>

            <div className="mt-8 py-6 border-y border-border">
              <p className="font-mono text-3xl">{formatArs(product.priceArs)}</p>
              <p className="text-xs text-muted mt-1">
                Precio final, IVA incluido. Envío se calcula en checkout.
              </p>
            </div>

            <form action={addToCartAndRedirect} className="mt-6 flex items-center gap-3">
              <input type="hidden" name="slug" value={product.slug} />
              <label className="flex items-center gap-3 border border-border">
                <span className="px-4 py-3 text-xs uppercase kerning-expanded text-muted">
                  Cantidad
                </span>
                <select
                  name="quantity"
                  defaultValue="1"
                  className="bg-transparent py-3 pr-4 font-mono text-sm focus:outline-none"
                >
                  {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <button
                type="submit"
                className="flex-1 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Agotado" : "Agregar al carrito"}
              </button>
            </form>

            <dl className="mt-10 grid grid-cols-2 gap-y-4 gap-x-10 text-sm font-mono">
              {product.cocoaPercent !== null && (
                <>
                  <dt className="text-muted">Cacao</dt>
                  <dd>{product.cocoaPercent}%</dd>
                </>
              )}
              <dt className="text-muted">Origen</dt>
              <dd>{product.originLabel}</dd>
              <dt className="text-muted">Tueste</dt>
              <dd className="capitalize">{product.roastLevel ?? "—"}</dd>
              <dt className="text-muted">Peso</dt>
              <dd>{product.weightG} g</dd>
              <dt className="text-muted">Batch</dt>
              <dd>{formatBatch(product.batchNumber, product.batchSize)}</dd>
              <dt className="text-muted">Stock</dt>
              <dd>{product.stock} u.</dd>
            </dl>
          </div>
        </div>
      </section>

      {/* notas + maridaje */}
      <section className="bg-background-warm border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <p className="eyebrow">Notas de cata</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">A qué sabe.</h2>
            <ul className="mt-6 space-y-2 text-base">
              {product.flavorNotes.map((n) => (
                <li key={n} className="flex items-baseline gap-3">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      background: `var(--${product.accentColor})`,
                    }}
                    aria-hidden
                  />
                  <span className="capitalize">{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <p className="eyebrow">Maridaje sugerido</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Con qué tomar.</h2>
            <ul className="mt-6 space-y-2 text-base">
              {product.pairings.map((p) => (
                <li key={p} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-muted">→</span>
                  <span className="capitalize">{p}</span>
                </li>
              ))}
            </ul>
            {product.contains.length > 0 && (
              <p className="mt-10 text-xs text-muted">
                <span className="eyebrow block mb-2">Contiene / trazas</span>
                {product.contains.join(" · ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-background">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 sm:py-20">
            <p className="eyebrow">Más en {product.category}</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Te puede gustar.</h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/tienda/${p.slug}`}
                  className="group border border-border hover:border-foreground transition-colors"
                >
                  <ProductImage
                    product={p}
                    className="aspect-[4/5] w-full"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="p-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow">{p.category}</p>
                      <p className="mt-1 font-display text-xl uppercase leading-none">
                        {p.shortName}
                      </p>
                    </div>
                    <span className="font-mono text-xs whitespace-nowrap">
                      {formatArs(p.priceArs)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </>
  );
}
