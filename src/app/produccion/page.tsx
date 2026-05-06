import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Producción · Bosque" };

const STEPS = [
  {
    n: "01",
    label: "Recepción",
    body: "Cacao en grano fermentado y seco llega de cooperativas de Tumaco, Chuao, San Martín y Ucayali. Cada saco trae trazabilidad de finca y fecha de fermentación.",
  },
  {
    n: "02",
    label: "Selección",
    body: "Limpieza manual: sacamos granos partidos, mohosos o con anomalías. Pasamos por imán para descartar metales. Lo que sobra es lo que entra a tueste.",
  },
  {
    n: "03",
    label: "Tueste",
    body: "Lotes chicos (3-8 kg) en tostadora horizontal. Curva de tueste por origen: medio para Tumaco/Ucayali, medio-alto para San Martín, alto para Chuao. Cada batch firmado por el operario.",
  },
  {
    n: "04",
    label: "Descascarillado",
    body: "Quebramos el grano y separamos cáscara de nibs con vientilador y tamiz manual. La cáscara se vende como infusión (cascarilla) o se composta.",
  },
  {
    n: "05",
    label: "Conchado",
    body: "Molino de piedra (melanger) durante 36 horas a 45°C. Refinamos hasta partícula de 18 micras. Acá se forma el cuerpo, la fluidez y se evapora la acidez excesiva.",
  },
  {
    n: "06",
    label: "Templado",
    body: "Templado en máquina rueda continua: 50°C → 28°C → 32°C. Esto da el snap y el brillo. Mezclamos con frutos del bosque deshidratados o relleno justo antes de moldear.",
  },
  {
    n: "07",
    label: "Moldeo",
    body: "Moldes policarbonato. Vibración 30 segundos para sacar burbujas. Cristalización 24 hs en cámara fría a 14°C. Desmolde manual.",
  },
  {
    n: "08",
    label: "Empaque",
    body: "Papel encerado interno + cartulina patagónica externa numerada y firmada. Rotulación con origen, fecha de producción, batch, alérgenos. Cierre con sello de cera vegana.",
  },
];

export default function ProduccionPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-cacao text-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-32">
          <p className="eyebrow text-background-cream/60">Producción</p>
          <h1 className="mt-4 text-7xl sm:text-9xl leading-[0.85]">
            Cómo se
            <br />
            hace.
          </h1>
          <p className="mt-8 max-w-2xl text-base sm:text-lg text-background-cream/80">
            Bean to bar real: del grano al producto terminado, todo en
            Bariloche. Producción semanal de 80 a 300 unidades por referencia
            según estacionalidad. No tercerizamos ningún paso.
          </p>
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
          {STEPS.map((s) => (
            <article key={s.n} className="bg-background p-8 sm:p-10">
              <p className="font-mono text-xs text-muted">{s.n}</p>
              <h2 className="mt-3 font-display text-3xl uppercase leading-none">
                {s.label}
              </h2>
              <p className="mt-4 text-base text-muted leading-relaxed">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-background-warm border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 text-center">
          <p className="eyebrow">Ver origen del cacao</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">4 cooperativas, perfiles distintos.</h2>
          <Link
            href="/origen"
            className="inline-flex mt-8 items-center gap-3 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
          >
            Ver orígenes
          </Link>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
