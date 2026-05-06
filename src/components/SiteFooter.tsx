import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-background-cream border-t border-border mt-auto">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 grid grid-cols-2 sm:grid-cols-4 gap-10">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-display text-2xl uppercase">BOSQUE</p>
          <p className="mt-4 text-sm text-muted max-w-xs">
            Chocolatería patagónica. Bariloche, Río Negro, Argentina.
          </p>
        </div>
        <div className="text-sm space-y-3">
          <p className="eyebrow">Tienda</p>
          <ul className="space-y-2">
            <li>
              <Link href="/tienda" className="hover:text-cacao">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/tienda?cat=tabletas" className="hover:text-cacao">
                Tabletas
              </Link>
            </li>
            <li>
              <Link href="/tienda?cat=bombones" className="hover:text-cacao">
                Bombones
              </Link>
            </li>
            <li>
              <Link href="/tienda?cat=tablones" className="hover:text-cacao">
                Tablones
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm space-y-3">
          <p className="eyebrow">Marca</p>
          <ul className="space-y-2">
            <li>
              <Link href="/origen" className="hover:text-cacao">
                Origen
              </Link>
            </li>
            <li>
              <Link href="/produccion" className="hover:text-cacao">
                Producción
              </Link>
            </li>
            <li>
              <Link href="/mayorista" className="hover:text-cacao">
                Mayorista
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm space-y-3">
          <p className="eyebrow">Ayuda</p>
          <ul className="space-y-2">
            <li>
              <Link href="/envios" className="hover:text-cacao">
                Envíos
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-cacao">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/legales" className="hover:text-cacao">
                Legales
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 h-14 flex items-center justify-between text-xs text-muted">
          <span>© 2026 Bosque · Bariloche, Patagonia</span>
          <span className="font-mono">v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
