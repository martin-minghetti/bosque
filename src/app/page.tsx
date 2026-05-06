import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-display tracking-tight">
            BOSQUE
          </Link>
          <nav className="hidden sm:flex items-center gap-10 text-[0.78rem] uppercase kerning-expanded">
            <Link href="/tienda">Tienda</Link>
            <Link href="/origen">Origen</Link>
            <Link href="/mayorista">Mayorista</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
          <div className="flex items-center gap-6 text-[0.78rem] uppercase kerning-expanded">
            <Link href="/cuenta" className="hidden sm:inline">Cuenta</Link>
            <Link href="/carrito">Carrito (0)</Link>
          </div>
        </div>
      </header>

      {/* Hero full-bleed */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-cacao text-background-cream">
        {/* Texture / placeholder gradient hasta meter foto real */}
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(120% 90% at 30% 30%, #6b3a1f 0%, #3d1f0f 45%, #1a0a04 100%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1600px] w-full px-6 sm:px-10 pb-16 sm:pb-24">
          <p className="eyebrow text-background-cream/70">
            Cosecha 2026 · Lote 014
          </p>
          <h1 className="mt-4 text-[14vw] sm:text-[10vw] leading-[0.85] max-w-[14ch]">
            Chocolate
            <br />
            de bosque.
          </h1>
          <p className="mt-8 max-w-md text-base sm:text-lg leading-relaxed text-background-cream/80">
            Cacao single-origin tostado en Bariloche. Frutos del bosque
            patagónico, dulce de leche de campo, especias de cordillera. Tabletas
            numeradas, batches de 80 a 200.
          </p>
          <div className="mt-10 flex items-center gap-4">
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

      {/* Marquee de categorías */}
      <section className="bg-background-warm border-y border-border py-6 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 flex items-center gap-12 sm:gap-20 text-[0.78rem] uppercase kerning-expanded text-muted whitespace-nowrap overflow-x-auto">
          <span>Tabletas single-origin</span>
          <span aria-hidden>·</span>
          <span>Bombones de autor</span>
          <span aria-hidden>·</span>
          <span>Tablones de regalo</span>
          <span aria-hidden>·</span>
          <span>Estuches limitados</span>
          <span aria-hidden>·</span>
          <span>Cacao en grano</span>
          <span aria-hidden>·</span>
          <span>Mayorista</span>
        </div>
      </section>

      {/* Featured: alternating L/R */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div
              className="aspect-[4/5] w-full bg-frutos-rojos"
              style={{
                background:
                  "radial-gradient(80% 70% at 60% 40%, #d83a26 0%, #a8210f 60%, #5b0d04 100%)",
              }}
              aria-label="Packshot tableta frutos rojos"
            />
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <p className="eyebrow">Edición de temporada</p>
            <h2 className="mt-4 text-6xl sm:text-7xl lg:text-8xl">
              Frutos
              <br />
              rojos
              <br />
              + 70%
            </h2>
            <p className="mt-8 text-base leading-relaxed text-muted max-w-md">
              Tableta de cacao 70% con calafate, sauco y rosa mosqueta del
              corredor de los Andes. Tueste medio. Notas de fruta madura, leve
              acidez y final largo.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-y-4 gap-x-10 text-sm font-mono">
              <dt className="text-muted">Origen</dt>
              <dd>Tumaco, Colombia</dd>
              <dt className="text-muted">Tueste</dt>
              <dd>Medio</dd>
              <dt className="text-muted">Peso</dt>
              <dd>80g</dd>
              <dt className="text-muted">Batch</dt>
              <dd>014 / 220</dd>
            </dl>
            <div className="mt-10 flex items-center gap-6">
              <Link
                href="/tienda/frutos-rojos-70"
                className="inline-flex items-center gap-3 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
              >
                Comprar · $8.900
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer mínimo */}
      <footer className="bg-background-cream border-t border-border mt-auto">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 grid grid-cols-2 sm:grid-cols-4 gap-10">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-2xl">BOSQUE</p>
            <p className="mt-4 text-sm text-muted max-w-xs">
              Chocolatería patagónica. Bariloche, Río Negro.
            </p>
          </div>
          <div className="text-sm space-y-3">
            <p className="eyebrow">Tienda</p>
            <ul className="space-y-2">
              <li><Link href="/tienda">Catálogo</Link></li>
              <li><Link href="/tienda/tabletas">Tabletas</Link></li>
              <li><Link href="/tienda/bombones">Bombones</Link></li>
              <li><Link href="/tienda/tablones">Tablones</Link></li>
            </ul>
          </div>
          <div className="text-sm space-y-3">
            <p className="eyebrow">Marca</p>
            <ul className="space-y-2">
              <li><Link href="/origen">Origen</Link></li>
              <li><Link href="/produccion">Producción</Link></li>
              <li><Link href="/mayorista">Mayorista</Link></li>
            </ul>
          </div>
          <div className="text-sm space-y-3">
            <p className="eyebrow">Ayuda</p>
            <ul className="space-y-2">
              <li><Link href="/envios">Envíos</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
              <li><Link href="/legales">Legales</Link></li>
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
    </>
  );
}
