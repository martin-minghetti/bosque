import Link from "next/link";
import { readCart } from "@/lib/cart";

export async function SiteHeader() {
  const cart = await readCart();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-display tracking-tight uppercase"
        >
          BOSQUE
        </Link>
        <nav className="hidden sm:flex items-center gap-10 text-[0.78rem] uppercase kerning-expanded">
          <Link href="/tienda">Tienda</Link>
          <Link href="/origen">Origen</Link>
          <Link href="/mayorista">Mayorista</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>
        <div className="flex items-center gap-6 text-[0.78rem] uppercase kerning-expanded">
          <Link href="/cuenta" className="hidden sm:inline">
            Cuenta
          </Link>
          <Link href="/carrito">
            Carrito ({cart.itemCount})
          </Link>
        </div>
      </div>
    </header>
  );
}
