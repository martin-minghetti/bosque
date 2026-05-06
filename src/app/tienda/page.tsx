import Link from "next/link";
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

      <section className="bg-background-warm border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 sm:py-24">
          <p className="eyebrow">Catálogo</p>
          <h1 className="mt-4 text-7xl sm:text-9xl leading-[0.85]">
            {filter ? CATEGORIES.find((c) => c.slug === filter)?.label : "Tienda"}
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted">
            {products.length} productos. Stock limitado por batch numerado.
            Envíos a todo el país en 3-9 días hábiles.
          </p>
        </div>
      </section>

      <section className="bg-background border-b border-border sticky top-16 z-40 backdrop-blur">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-4 flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <Link
            href="/tienda"
            className={`text-[0.78rem] uppercase kerning-expanded px-4 py-2 border ${
              !filter
                ? "bg-foreground text-background-cream border-foreground"
                : "border-border hover:border-foreground"
            }`}
          >
            Todo
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/tienda?cat=${c.slug}`}
              className={`text-[0.78rem] uppercase kerning-expanded px-4 py-2 border whitespace-nowrap ${
                filter === c.slug
                  ? "bg-foreground text-background-cream border-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
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
      className="group flex flex-col bg-background border border-border hover:border-foreground transition-colors"
    >
      <ProductImage
        product={product}
        className="aspect-[4/5] w-full"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
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
