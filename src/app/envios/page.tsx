import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  SHIPPING_RATES,
  SHIPPING_ZONES,
  CARRIER_LABEL,
} from "@/lib/shipping";
import { formatArs } from "@/lib/format";

export const metadata = { title: "Envíos · Bosque" };

export default function EnviosPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-background-warm">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-20 sm:py-32">
          <p className="eyebrow">Política de envíos</p>
          <h1 className="mt-4 text-7xl sm:text-9xl leading-[0.85]">
            Envíos.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted">
            Despachamos a todo el país con tres transportes. El costo se calcula
            en checkout según código postal. Tarifas fijas por zona, sin
            sorpresas.
          </p>
        </div>
      </section>

      <section className="bg-background border-y border-border">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background-warm border-b border-border">
              <tr className="text-[0.7rem] uppercase kerning-expanded text-muted">
                <th className="px-4 py-3 text-left">Zona</th>
                <th className="px-4 py-3 text-left">Provincias</th>
                <th className="px-4 py-3 text-left">Transporte</th>
                <th className="px-4 py-3 text-right">Costo</th>
                <th className="px-4 py-3 text-left">Plazo</th>
              </tr>
            </thead>
            <tbody>
              {SHIPPING_ZONES.flatMap((zone) =>
                SHIPPING_RATES.filter((r) => r.zone === zone.slug).map(
                  (r, idx) => (
                    <tr
                      key={`${r.zone}-${r.carrier}`}
                      className="border-b border-border"
                    >
                      <td className="px-4 py-3 font-medium">
                        {idx === 0 ? zone.label : ""}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted max-w-md">
                        {idx === 0 ? zone.provinces.join(" · ") : ""}
                      </td>
                      <td className="px-4 py-3">
                        {CARRIER_LABEL[r.carrier]}
                      </td>
                      <td className="px-4 py-3 font-mono text-right">
                        {formatArs(r.costArs)}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">
                        {r.estimatedDays}
                      </td>
                    </tr>
                  ),
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-background-cream">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <p className="eyebrow">Cuándo despachamos</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">24-48 hs hábiles.</h2>
            <p className="mt-4 text-base text-muted">
              Pedidos confirmados antes de las 14 hs ART salen al día siguiente
              hábil. Sábados, domingos y feriados no se despacha. Te enviamos
              tracking por email cuando sale el paquete.
            </p>
          </div>
          <div>
            <p className="eyebrow">Frío en verano</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Pack térmico opcional.</h2>
            <p className="mt-4 text-base text-muted">
              De diciembre a marzo, agregamos pack térmico con gel refrigerante
              sin costo extra para destinos al norte de Buenos Aires.
              Despachamos los lunes y martes para que no quede en tránsito el
              fin de semana.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
