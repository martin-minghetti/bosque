import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Pago en revisión · Bosque" };

export default function PendingPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-dulce-leche text-foreground">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 py-24 text-center">
          <p className="eyebrow">En revisión</p>
          <h1 className="mt-4 text-6xl sm:text-8xl leading-[0.85]">
            Quedó pendiente.
          </h1>
          <p className="mt-6 text-base sm:text-lg max-w-md mx-auto">
            Mercado Pago necesita confirmar tu pago. Cuando se acredite vas a
            recibir un mail con el comprobante y empezamos a preparar el
            despacho.
          </p>
          <Link
            href="/"
            className="inline-flex mt-8 items-center gap-3 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
