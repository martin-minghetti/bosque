import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { readCart } from "@/lib/cart";
import { isDbConfigured } from "@/db";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout · Bosque" };

export default async function CheckoutPage() {
  if (!isDbConfigured) {
    return (
      <>
        <SiteHeader />
        <section className="bg-background-warm">
          <div className="mx-auto max-w-3xl px-6 sm:px-10 py-24 text-center">
            <p className="eyebrow">Modo demo</p>
            <h1 className="mt-4 text-5xl">Falta DB.</h1>
            <p className="mt-6 text-base text-muted">
              El checkout requiere DATABASE_URL configurada.
            </p>
          </div>
        </section>
        <SiteFooter />
      </>
    );
  }

  const cart = await readCart();
  if (cart.lines.length === 0) {
    redirect("/carrito");
  }

  return (
    <>
      <SiteHeader />
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-12">
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-3 text-5xl sm:text-7xl leading-[0.85]">
            Finalizar compra.
          </h1>
        </div>
      </section>
      <section className="bg-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-12">
          <CheckoutForm subtotalArs={cart.subtotalArs} />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
