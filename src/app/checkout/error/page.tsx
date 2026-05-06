import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Pago no procesado · Bosque" };

export default function FailedPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-frutos-rojos text-background-cream">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 py-24 text-center">
          <p className="eyebrow text-background-cream/70">Pago no aprobado</p>
          <h1 className="mt-4 text-6xl sm:text-8xl leading-[0.85]">
            Algo salió mal.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-background-cream/80 max-w-md mx-auto">
            No pudimos procesar tu pago. Tu carrito sigue activo si querés
            volver a intentar con otra tarjeta.
          </p>
          <Link
            href="/carrito"
            className="inline-flex mt-8 items-center gap-3 bg-background-cream text-foreground px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-background transition-colors"
          >
            Volver al carrito
          </Link>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
