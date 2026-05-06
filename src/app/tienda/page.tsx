import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  PRODUCTS,
  CATEGORIES,
  type ProductCategory,
  type Product,
} from "@/data/products";
import { formatArs } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { Reveal, RevealStagger, RevealItem, HeroFade, HeroImageFade } from "@/components/Reveal";

export const metadata = {
  title: "Tienda · Bosque",
  description: "Catálogo completo de chocolatería patagónica.",
};

const CAT_VALUES: ProductCategory[] = [
  "tabletas",
  "bombones",
  "tablones",
  "estuches",
  "granos",
];

function isCategory(value: unknown): value is ProductCategory {
  return typeof value === "string" && (CAT_VALUES as string[]).includes(value);
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const params = await searchParams;
  const filter = isCategory(params.cat) ? params.cat : null;
  const products = filter
    ? PRODUCTS.filter((p) => p.category === filter && p.active)
    : PRODUCTS.filter((p) => p.active);

  return (
    <>
      <SiteHeader />

      <section className="relative bg-cacao text-background-cream overflow-hidden">
        <HeroImageFade className="absolute inset-0">
          <Image
            src="/hero/tienda.jpg"
            alt="Surtido de chocolates artesanales"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-50"
          />
        </HeroImageFade>
        <div className="absolute inset-0 bg-gradient-to-r from-cacao via-cacao/85 to-cacao/30" aria-hidden />
        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 py-16 sm:py-24">
          <HeroFade>
            <p className="eyebrow text-background-cream/70">Catálogo</p>
            <h1 className="mt-4 text-7xl sm:text-9xl leading-[0.85]">
              {filter ? CATEGORIES.find((c) => c.slug === filter)?.label : "Tienda"}
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-background-cream/80">
              {products.length} productos. Stock limitado por batch numerado.
              Envíos a todo el país en 3-9 días hábiles.
            </p>
          </HeroFade>
        </div>
      </section>

      <section className="bg-background border-b border-border sticky top-16 z-40 backdrop-blur">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-4 flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <Link
            href="/tienda"
            className={`text-[0.78rem] uppercase kerning-expanded px-4 py-2 border transition-all duration-300 ${
              !filter
                ? "bg-foreground text-background-cream border-foreground"
                : "border-border hover:border-foreground hover:bg-background-warm"
            }`}
          >
            Todo
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/tienda?cat=${c.slug}`}
              className={`text-[0.78rem] uppercase kerning-expanded px-4 py-2 border whitespace-nowrap transition-all duration-300 ${
                filter === c.slug
                  ? "bg-foreground text-background-cream border-foreground"
                  : "border-border hover:border-foreground hover:bg-background-warm"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 sm:py-20">
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((p) => (
              <RevealItem key={p.slug}>
                <ProductCard product={p} />
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group flex flex-col bg-background border border-border hover:border-foreground transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="overflow-hidden">
        <ProductImage
          product={product}
          className="aspect-[4/5] w-full transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">
              {product.category} · {product.weightG}g
            </p>
            <h3 className="mt-2 font-display text-2xl uppercase leading-none">
              {product.shortName}
            </h3>
          </div>
          <span className="font-mono text-sm whitespace-nowrap">
            {formatArs(product.priceArs)}
          </span>
        </div>
        <p className="text-sm text-muted line-clamp-2 mt-auto">
          {product.description}
        </p>
        <div className="flex items-center justify-between text-xs font-mono text-muted pt-3 border-t border-border">
          <span>
            {product.cocoaPercent ? `${product.cocoaPercent}% cacao` : product.originLabel}
          </span>
          <span>
            {product.stock > 0 ? `Stock ${product.stock}` : "Agotado"}
          </span>
        </div>
      </div>
    </Link>
  );
}
