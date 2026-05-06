import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Legales · Bosque" };

export default function LegalesPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-background-warm">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-24">
          <p className="eyebrow">Legales</p>
          <h1 className="mt-4 text-6xl sm:text-7xl leading-[0.85]">
            Términos.
          </h1>
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 py-16 prose-bosque space-y-10 text-base leading-relaxed text-foreground">
          <Block title="Quiénes somos">
            <p>
              Bosque es una marca de chocolatería patagónica con sede en San
              Carlos de Bariloche, provincia de Río Negro, Argentina. Toda la
              producción se realiza en Argentina cumpliendo regulaciones de
              bromatología municipal y ANMAT. (Demo de portfolio: empresa
              ficticia.)
            </p>
          </Block>

          <Block title="Política de cambios y devoluciones">
            <p>
              Por tratarse de productos alimenticios, no aceptamos devoluciones
              salvo defecto evidente comunicado dentro de las 48 hs de
              recepción del paquete. Si hay rotura por transporte o llegada con
              fecha vencida, gestionamos reposición sin costo o reintegro
              completo según preferencia del cliente.
            </p>
            <p>
              Conforme Ley 24.240 de Defensa del Consumidor (Argentina), las
              compras a distancia tienen 10 días corridos para retracto desde
              la recepción, salvo productos perecederos abiertos.
            </p>
          </Block>

          <Block title="Privacidad y datos">
            <p>
              Recolectamos solo los datos necesarios para procesar tu compra:
              nombre, email, teléfono opcional y dirección de envío. No
              compartimos información con terceros excepto el transporte
              elegido (Andreani, Correo Argentino u OCA) y el procesador de
              pagos (Mercado Pago).
            </p>
            <p>
              Cumplimos con Ley 25.326 de Protección de Datos Personales.
              Podés solicitar acceso, rectificación o eliminación de tus datos
              escribiendo a{" "}
              <a href="mailto:hola@bosque.example" className="underline hover:text-cacao">
                hola@bosque.example
              </a>
              .
            </p>
          </Block>

          <Block title="Procesamiento de pagos">
            <p>
              Los pagos se procesan a través de Mercado Pago. No almacenamos
              datos de tarjetas en nuestros servidores. La transacción se
              completa en infraestructura PCI-DSS de Mercado Pago.
            </p>
            <p>
              En modo demo público, el flow de pago se simula y no se cobra
              dinero real.
            </p>
          </Block>

          <Block title="Propiedad intelectual">
            <p>
              Todo el contenido del sitio (textos, imágenes, marcas, recetas,
              identidad visual) es propiedad de Bosque. Reproducción no
              autorizada queda prohibida.
            </p>
          </Block>

          <Block title="Demo / Portfolio">
            <p>
              Este sitio es un demo de portfolio construido por{" "}
              <a
                href="https://github.com/martin-minghetti/bosque"
                className="underline hover:text-cacao"
              >
                Martín Minghetti
              </a>{" "}
              como showcase técnico de stack ecommerce AR (Next 16 + Drizzle +
              Neon + Mercado Pago). La marca, el catálogo y los precios son
              ficticios pero plausibles. El código está disponible bajo
              condiciones de portfolio personal.
            </p>
          </Block>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl uppercase">{title}</h2>
      <div className="space-y-3 text-muted">{children}</div>
    </div>
  );
}
