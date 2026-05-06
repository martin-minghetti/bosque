import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductImage } from "@/components/ProductImage";
import { findProduct, PRODUCTS } from "@/data/products";
import { formatArs, formatBatch } from "@/lib/format";
import { Reveal, HeroFade, HeroImageFade } from "@/components/Reveal";

export default function Home() {
  const featured = findProduct("frutos-rojos-70") ?? PRODUCTS[0];

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

      <section className="relative min-h-[88vh] flex items-end overflow-hidden text-background-cream">
        <HeroImageFade className="absolute inset-0">
          <Image
            src="/hero/main.jpg"
            alt="Lago patagónico al amanecer"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </HeroImageFade>
        <div className="absolute inset-0 bg-gradient-to-t from-cacao via-cacao/60 to-cacao/10" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[1600px] w-full px-6 sm:px-10 pb-16 sm:pb-24">
          <HeroFade>
            <p className="eyebrow text-background-cream/80">
              Cosecha 2026 · Lote {String(featured.batchNumber).padStart(3, "0")}
            </p>
            <h1 className="mt-4 text-[14vw] sm:text-[10vw] leading-[0.85] max-w-[14ch] drop-shadow-2xl">
              Chocolate
              <br />
              de bosque.
            </h1>
            <p className="mt-8 max-w-md text-base sm:text-lg leading-relaxed text-background-cream/90">
              Cacao single-origin tostado en Bariloche. Frutos del bosque
              patagónico, dulce de leche de campo, especias de cordillera.
              Tabletas numeradas, batches de 80 a 300.
            </p>
            <div className="mt-10 flex items-center gap-4 flex-wrap">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-3 bg-background-cream text-foreground px-6 sm:px-8 py-4 text-[0.78rem] uppercase kerning-expanded transition-all duration-500 ease-out hover:bg-background hover:gap-5"
              >
                Ver tienda <span aria-hidden>→</span>
              </Link>
              <Link
                href="/origen"
                className="inline-flex items-center gap-2 text-[0.78rem] uppercase kerning-expanded text-background-cream/90 hover:text-background-cream transition-colors duration-300"
              >
                Origen del cacao
              </Link>
            </div>
          </HeroFade>
        </div>
      </section>

      <section className="bg-background-warm border-y border-border py-6 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 flex items-center gap-12 sm:gap-20 text-[0.78rem] uppercase kerning-expanded text-muted whitespace-nowrap overflow-x-auto">
          {categoryHighlights.map((c, i) => (
            <span key={c.slug} className="flex items-center gap-12 sm:gap-20">
              <Link
                href={`/tienda?cat=${c.slug}`}
                className="hover:text-foreground transition-colors duration-300"
              >
                {c.label} <span className="text-muted/60">· {c.count}</span>
              </Link>
              {i < categoryHighlights.length - 1 && <span aria-hidden>·</span>}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-7 order-2 lg:order-1">
            <ProductImage
              product={featured}
              className="aspect-[4/5] w-full"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </Reveal>
          <Reveal className="lg:col-span-5 order-1 lg:order-2" delay={0.15}>
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
                className="inline-flex items-center gap-3 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded transition-all duration-500 ease-out hover:bg-cacao hover:gap-5"
              >
                Comprar · {formatArs(featured.priceArs)}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-cacao text-background-cream overflow-hidden">
        <Image
          src="/hero/mayorista.jpg"
          alt="Local cafetería interior madera"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cacao via-cacao/85 to-cacao/40" aria-hidden />
        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-background-cream/70">B2B · Mayorista</p>
            <h2 className="mt-4 text-5xl sm:text-6xl lg:text-7xl">
              Cafeterías,
              <br />
              hoteles,
              <br />
              regalo corporativo.
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.2}>
            <p className="text-base sm:text-lg leading-relaxed text-background-cream/90">
              Volumen mínimo 30 unidades, descuento 35%, etiquetado co-branded
              opcional, despacho semanal a CABA y lugares con frío. Atendemos
              consultas todos los días excepto domingos.
            </p>
            <Link
              href="/mayorista"
              className="mt-8 inline-flex items-center gap-3 bg-background-cream text-foreground px-8 py-4 text-[0.78rem] uppercase kerning-expanded transition-all duration-500 ease-out hover:bg-background hover:gap-5"
            >
              Pedir lista mayorista
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
