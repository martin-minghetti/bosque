import Image from "next/image";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ProductImage({ product, className = "", sizes, priority }: Props) {
  if (product.imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-background-warm ${className}`}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: product.heroGradient }}
      role="img"
      aria-label={`Packshot ${product.name}`}
    >
      <div className="absolute inset-0 flex items-end p-6 text-background-cream/80 pointer-events-none">
        <span className="font-display text-3xl uppercase leading-none">
          {product.shortName}
        </span>
      </div>
    </div>
  );
}
