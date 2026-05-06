import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Origen del cacao · Bosque" };

const ORIGINS = [
  {
    region: "Tumaco · Colombia",
    notes: "Pacífico colombiano, microclima húmedo, fermentación 6 días.",
    perfil: "frutas rojas, panela, leve acidez cítrica",
    productor: "Cooperativa de pequeños productores · 28 familias",
    tueste: "Medio · 18 min a 118°C",
  },
  {
    region: "Chuao · Venezuela",
    notes: "Costa norte de Venezuela, cacao criollo histórico.",
    perfil: "tabaco, café tostado, taninos largos",
    productor: "Empresa Campesina Chuao · finca centenaria",
    tueste: "Alto · 22 min a 124°C",
  },
  {
    region: "San Martín · Perú",
    notes: "Selva alta, sombra de plátano, floración en marzo.",
    perfil: "fruta tropical, miel, herbal fresco",
    productor: "Asociación de productores ASCOPI · 60 familias",
    tueste: "Medio-alto · 20 min a 121°C",
  },
  {
    region: "Ucayali · Perú",
    notes: "Cuenca amazónica, fermentación en cajones de madera 5 días.",
    perfil: "leche tostada, dulce limpio, dejo a almendra",
    productor: "Cooperativa Acopagro · 1.500 socios certificados",
    tueste: "Medio · 18 min a 118°C",
  },
];

export default function OrigenPage() {
  return (
    <>
      <SiteHeader />
      <section className="relative bg-cacao text-background-cream overflow-hidden">
        <Image
          src="/hero/origen.jpg"
          alt="Flor del árbol de cacao"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cacao via-cacao/80 to-cacao/40" aria-hidden />
        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-32">
          <p className="eyebrow text-background-cream/70">Origen</p>
          <h1 className="mt-4 text-7xl sm:text-9xl leading-[0.85]">
            De dónde
            <br />
            viene el cacao.
          </h1>
          <p className="mt-8 max-w-2xl text-base sm:text-lg text-background-cream/80">
            Trabajamos con cuatro orígenes fijos. Compramos directo a cooperativas
            con relación directa, pagamos sobre precio internacional, y usamos
            siempre lotes de fermentación trazable. No hay blends genéricos.
          </p>
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
          {ORIGINS.map((o) => (
            <article key={o.region} className="bg-background p-8">
              <h2 className="font-display text-3xl uppercase leading-none">
                {o.region}
              </h2>
              <p className="mt-4 text-base text-muted">{o.notes}</p>
              <dl className="mt-6 grid grid-cols-1 gap-3 text-sm font-mono">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Perfil</dt>
                  <dd className="text-right">{o.perfil}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Productor</dt>
                  <dd className="text-right">{o.productor}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Tueste</dt>
                  <dd className="text-right">{o.tueste}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-background border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">Cómo lo hacemos</p>
            <h2 className="mt-3 text-5xl sm:text-6xl">Bean to bar.</h2>
          </div>
          <div className="lg:col-span-7 space-y-6 text-base leading-relaxed text-muted">
            <p>
              Compramos cacao en grano fermentado y seco. Lo recibimos en
              Bariloche, lo limpiamos, lo tostamos en lotes chicos según el
              perfil de cada origen, lo descascarillamos a mano y lo pasamos por
              molino de piedra durante 36 horas para conchar.
            </p>
            <p>
              Después templamos, moldeamos, dejamos cristalizar 24 horas y
              empacamos. Cada batch lleva número, fecha y firma del que lo hizo.
              Si una tableta lleva calafate o sauco, los recolectamos en
              temporada del bosque andino y los deshidratamos a baja temperatura
              en horno propio.
            </p>
            <p>
              Producción semanal: 80 a 300 unidades por referencia según
              estacionalidad. Cuando un batch se agota, esperamos al siguiente,
              no improvisamos.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background-warm border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 text-center">
          <p className="eyebrow">Probalo</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">12 referencias en stock.</h2>
          <Link
            href="/tienda"
            className="inline-flex mt-8 items-center gap-3 bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors"
          >
            Ver tienda
          </Link>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
