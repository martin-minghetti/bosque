import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { findProduct, PRODUCTS } from "@/data/products";
import { formatArs, formatBatch } from "@/lib/format";

export default function Home() {
  const featured =
    findProduct("frutos-rojos-70") ?? PRODUCTS[0];

  const categoryHighlights = [
    { slug: "tabletas", label: "Tabletas single-origin", count: PRODUCTS.filter((p) => p.category === "tabletas").length },
    { slug: "bombones", label: "Bombones de autor", count: PRODUCTS.filter((p) => p.category === "bombones").length },
    { slug: "tablones", label: "Tablones de regalo", count: PRODUCTS.filter((p) => p.category === "tablones").length },
    { slug: "estuches", label: "Estuches limitados", count: PRODUCTS.filter((p) => p.category === "estuches").length },
    { slug: "granos", label: "Cacao en grano", count: PRODUCTS.filter((p) => p.category === "granos").length },
  ];

  return (
    <>
      <SiteHeader />

      <section
        className="relative min-h-[88vh] flex items-end overflow-hidden text-background-cream"
        style={{ background: featured.heroGradient }}
      >
        <div className="relative z-10 mx-auto max-w-[1600px] w-full px-6 sm:px-10 pb-16 sm:pb-24">
          <p className="eyebrow text-background-cream/70">
            Cosecha 2026 · Lote {String(featured.batchNumber).padStart(3, "0")}
          </p>
          <h1 className="mt-4 text-[14vw] sm:text-[10vw] leading-[0.85] max-w-[14ch]">
            Chocolate
            <br />
            de bosque.
          </h1>
          <p className="mt-8 max-w-md text-base sm:text-lg leading-relaxed text-background-cream/80">
            Cacao single-origin tostado en Bariloche. Frutos del bosque
            patagónico, dulce de leche de campo, especias de cordillera.
            Tabletas numeradas, batches de 80 a 300.
          </p>
          <div className="mt-10 flex items-center gap-4 flex-wrap">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-3 bg-background-cream text-foreground px-6 sm:px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-background transition-colors"
            >
              Ver tienda <span aria-hidden>→</span>
            </Link>
            <Link
              href="/origen"
              className="inline-flex items-center gap-2 text-[0.78rem] uppercase kerning-expanded text-background-cream/80 hover:text-background-cream"
            >
              Origen del cacao
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee categorías */}
      <section className="bg-background-warm border-y border-border py-6 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 flex items-center gap-12 sm:gap-20 text-[0.78rem] uppercase kerning-expanded text-muted whitespace-nowrap overflow-x-auto">
          {categoryHighlights.map((c, i) => (
            <span key={c.slug} className="flex items-center gap-12 sm:gap-20">
              <Link href={`/tienda?cat=${c.slug}`} className="hover:text-foreground">
                {c.label} <span className="text-muted/60">· {c.count}</span>
              </Link>
              {i < categoryHighlights.length - 1 && <span aria-hidden>·</span>}
            </span>
          ))}
        </div>
      </section>

      {/* Producto destacado */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div
              className="aspect-[4/5] w-full"
              style={{ background: featured.heroGradient }}
              aria-label={`Packshot ${featured.name}`}
            />
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <p className="eyebrow">Edición de temporada</p>
            <h2 className="mt-4 text-6xl sm:text-7xl lg:text-8xl">
              {featured.shortName.split(" ").map((w, i) => (
                <span key={i} className="block">
                  {w}
                </span>
              ))}
            </h2>
            <p className="mt-8 text-base leading-relaxed text-muted max-w-md">
              {featured.longDescription}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-y-4 gap-x-10 text-sm font-mono">
              <dt className="text-muted">Origen</dt>
              <dd>{featured.originLabel}</dd>
              <dt className="text-muted">Tueste</dt>
              <dd className="capitalize">{featured.roastLevel ?? "—"}</dd>
              <dt className="text-muted">Peso</dt>
              <dd>{featured.weightG} g</dd>
              <dt className="text-muted">Batch</dt>
              <dd>{formatBatch(featured.batchNumber, featured.batchSize)}</dd>
            </dl>
            <div className="mt-10 flex items-center gap-6">
              <Link
                href={`/tienda/${featured.slug}`}
                className="inline-flex items-center gap-3 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
              >
                Comprar · {formatArs(featured.priceArs)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA mayorista */}
      <section className="bg-cacao text-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow text-background-cream/60">B2B · Mayorista</p>
            <h2 className="mt-4 text-5xl sm:text-6xl lg:text-7xl">
              Cafeterías,
              <br />
              hoteles,
              <br />
              regalo corporativo.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg leading-relaxed text-background-cream/80">
              Volumen mínimo 30 unidades, descuento 35%, etiquetado co-branded
              opcional, despacho semanal a CABA y lugares con frío. Atendemos
              consultas todos los días excepto domingos.
            </p>
            <Link
              href="/mayorista"
              className="mt-8 inline-flex items-center gap-3 bg-background-cream text-foreground px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-background transition-colors"
            >
              Pedir lista mayorista
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
