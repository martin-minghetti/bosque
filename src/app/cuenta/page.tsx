import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Cuenta · Bosque" };

export default function CuentaPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-background-warm">
        <div className="mx-auto max-w-2xl px-6 sm:px-10 py-24 sm:py-32 text-center">
          <p className="eyebrow">Cuenta</p>
          <h1 className="mt-4 text-6xl sm:text-7xl leading-[0.85]">
            Sin cuenta.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted">
            En esta versión del demo no manejamos cuentas de cliente. Las
            compras se hacen como invitado: dejás email + dirección y recibís
            tracking + comprobante por mail. El historial de pedidos vive del
            lado del comercio en{" "}
            <Link href="/admin" className="underline hover:text-cacao">
              /admin
            </Link>
            .
          </p>
          <p className="mt-4 text-sm text-muted">
            En deploy comercial real con cliente, este endpoint se reemplaza
            por auth (Clerk / Auth.js / magic-link) según preferencia.
          </p>
          <Link
            href="/tienda"
            className="inline-flex mt-10 items-center gap-3 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
          >
            Ir a tienda
          </Link>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
