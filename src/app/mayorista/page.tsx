import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Mayorista B2B · Bosque" };

export default function MayoristaPage() {
  return (
    <>
      <SiteHeader />
      <section className="relative bg-background-warm overflow-hidden">
        <Image
          src="/hero/mayorista.jpg"
          alt="Local cafetería interior"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background-warm via-background-warm/85 to-background-warm/20" aria-hidden />
        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-32">
          <p className="eyebrow">B2B · Mayorista</p>
          <h1 className="mt-4 text-7xl sm:text-9xl leading-[0.85]">
            Mayorista.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted">
            Distribuimos a cafeterías, hoteles boutique, vinerías, y empresas
            que quieren dar regalo corporativo serio. Volumen mínimo 30
            unidades, descuento del 35%, etiquetado co-branded opcional.
          </p>
        </div>
      </section>

      <section className="bg-background border-y border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border">
          <Plan
            label="Cafeterías"
            min="30 u."
            discount="35%"
            extras="Carta de origen impresa, soporte de cata para staff."
          />
          <Plan
            label="Hoteles"
            min="50 u."
            discount="40%"
            extras="Bombones individuales para amenity, etiqueta co-branded."
          />
          <Plan
            label="Corporate"
            min="100 u."
            discount="45%"
            extras="Estuches numerados con dedicatoria, despacho directo a destinatarios."
          />
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-2xl px-6 sm:px-10 py-16">
          <p className="eyebrow">Pedinos lista</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Hablemos.</h2>
          <form className="mt-8 space-y-4">
            <Input name="empresa" label="Empresa" required />
            <Input name="nombre" label="Tu nombre" required />
            <Input name="email" type="email" label="Email" required />
            <Input name="rubro" label="Rubro (cafetería, hotel, etc)" />
            <label className="block">
              <span className="text-xs text-muted uppercase kerning-expanded block mb-2">
                Contanos qué buscás
              </span>
              <textarea
                name="mensaje"
                rows={4}
                className="w-full border border-border bg-background px-4 py-3 text-base focus:outline-none focus:border-foreground"
              />
            </label>
            <button
              type="submit"
              disabled
              className="w-full bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded disabled:opacity-60"
            >
              Enviar (demo)
            </button>
            <p className="text-xs text-muted">
              En el demo no enviamos el form. En producción dispara un email a
              ventas y crea ticket en CRM.
            </p>
          </form>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

function Plan({
  label,
  min,
  discount,
  extras,
}: {
  label: string;
  min: string;
  discount: string;
  extras: string;
}) {
  return (
    <div className="bg-background p-8">
      <p className="eyebrow">{label}</p>
      <p className="mt-4 font-display text-5xl uppercase leading-none">
        {discount}
      </p>
      <p className="mt-2 text-sm text-muted">descuento desde {min}</p>
      <p className="mt-6 text-sm leading-relaxed">{extras}</p>
    </div>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted uppercase kerning-expanded block mb-2">
        {label}
        {required && <span className="text-frutos-rojos ml-1">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border border-border bg-background px-4 py-3 text-base focus:outline-none focus:border-foreground"
      />
    </label>
  );
}
