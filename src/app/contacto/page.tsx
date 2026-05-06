import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Contacto · Bosque" };

export default function ContactoPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-background-warm">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-32">
          <p className="eyebrow">Contacto</p>
          <h1 className="mt-4 text-7xl sm:text-9xl leading-[0.85]">
            Escribinos.
          </h1>
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="eyebrow">Atención al cliente</p>
              <p className="mt-3 text-2xl">hola@bosque.example</p>
              <p className="text-sm text-muted mt-2">
                Respondemos lunes a viernes, 9 a 18 hs (ART).
              </p>
            </div>
            <div>
              <p className="eyebrow">Mayorista</p>
              <p className="mt-3 text-2xl">ventas@bosque.example</p>
              <p className="text-sm text-muted mt-2">
                B2B, hoteles, cafeterías, regalo corporativo.
              </p>
            </div>
            <div>
              <p className="eyebrow">Local</p>
              <p className="mt-3 text-base">
                Mitre 1234, San Carlos de Bariloche, Río Negro
              </p>
              <p className="text-sm text-muted mt-2">
                Martes a sábado, 10 a 19 hs.
              </p>
            </div>
            <div>
              <p className="eyebrow">Redes</p>
              <ul className="mt-3 space-y-2 text-base">
                <li>Instagram · @bosque.chocolate</li>
                <li>WhatsApp · +54 9 294 4 12-3456</li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7">
            <form className="bg-background border border-border p-8 space-y-4">
              <Input name="nombre" label="Tu nombre" required />
              <Input name="email" type="email" label="Email" required />
              <Input name="asunto" label="Asunto" />
              <label className="block">
                <span className="text-xs text-muted uppercase kerning-expanded block mb-2">
                  Mensaje
                </span>
                <textarea
                  name="mensaje"
                  rows={6}
                  className="w-full border border-border bg-background-cream px-4 py-3 text-base focus:outline-none focus:border-foreground"
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
                En el demo no enviamos el form. En producción dispara un email
                via Resend y notifica a slack interno.
              </p>
            </form>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
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
        className="w-full border border-border bg-background-cream px-4 py-3 text-base focus:outline-none focus:border-foreground"
      />
    </label>
  );
}
