"use client";

import { useState, useTransition, useMemo } from "react";
import { createOrderAction } from "@/app/actions/checkout";
import {
  CARRIER_LABEL,
  SHIPPING_RATES,
  postalCodeToZone,
  type ShippingCarrier,
} from "@/lib/shipping";

const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function CheckoutForm({ subtotalArs }: { subtotalArs: number }) {
  const [postal, setPostal] = useState("");
  const [carrier, setCarrier] = useState<ShippingCarrier>("andreani");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const zone = useMemo(() => postalCodeToZone(postal), [postal]);
  const rate = useMemo(() => {
    if (!zone) return null;
    return SHIPPING_RATES.find((r) => r.zone === zone && r.carrier === carrier) ?? null;
  }, [zone, carrier]);

  const total = subtotalArs + (rate?.costArs ?? 0);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createOrderAction(formData);
      if (!res.ok) setError(res.error ?? "Error procesando checkout");
    });
  }

  return (
    <form
      action={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
    >
      {/* Datos */}
      <div className="lg:col-span-7 space-y-8">
        <fieldset className="space-y-4">
          <legend className="eyebrow mb-2">Tus datos</legend>
          <Input name="customerName" label="Nombre completo" required />
          <Input name="customerEmail" type="email" label="Email" required />
          <Input name="customerPhone" label="Teléfono (opcional)" />
        </fieldset>

        <fieldset className="space-y-4 pt-6 border-t border-border">
          <legend className="eyebrow mb-2">Dirección de envío</legend>
          <Input name="shippingAddress" label="Calle y número" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="shippingCity" label="Ciudad" required />
            <Input name="shippingProvince" label="Provincia" required />
          </div>
          <Input
            name="shippingPostal"
            label="Código postal"
            required
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
            hint={
              zone
                ? `Zona detectada: ${zone === "caba_gba" ? "CABA + GBA" : zone === "interior_chico" ? "Interior cercano" : "Interior lejano"}`
                : "Ingresá tu CP para calcular envío"
            }
          />
        </fieldset>

        <fieldset className="space-y-3 pt-6 border-t border-border">
          <legend className="eyebrow mb-2">Transporte</legend>
          {(["andreani", "correo", "oca"] as ShippingCarrier[]).map((c) => {
            const r = SHIPPING_RATES.find(
              (x) => x.carrier === c && x.zone === (zone ?? "caba_gba"),
            );
            return (
              <label
                key={c}
                className={`flex items-center justify-between gap-4 p-4 border cursor-pointer ${
                  carrier === c ? "border-foreground" : "border-border"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingCarrier"
                    value={c}
                    checked={carrier === c}
                    onChange={() => setCarrier(c)}
                    className="accent-foreground"
                  />
                  <span>
                    <span className="block font-display text-xl uppercase">
                      {CARRIER_LABEL[c]}
                    </span>
                    {r && (
                      <span className="block text-xs text-muted">
                        {r.estimatedDays}
                      </span>
                    )}
                  </span>
                </span>
                <span className="font-mono text-sm">
                  {r ? ARS.format(r.costArs) : "—"}
                </span>
              </label>
            );
          })}
        </fieldset>

        <fieldset className="pt-6 border-t border-border">
          <legend className="eyebrow mb-2">Notas (opcional)</legend>
          <textarea
            name="notes"
            rows={3}
            placeholder="Referencias para la entrega, dedicatoria, etc."
            className="w-full border border-border bg-background-cream px-4 py-3 text-base focus:outline-none focus:border-foreground"
          />
        </fieldset>
      </div>

      {/* Resumen */}
      <aside className="lg:col-span-5 lg:sticky lg:top-24">
        <div className="border border-border bg-background p-6 space-y-4">
          <p className="eyebrow">Resumen</p>
          <dl className="space-y-3 text-sm font-mono">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{ARS.format(subtotalArs)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Envío {carrier && rate && `· ${CARRIER_LABEL[carrier]}`}</dt>
              <dd>{rate ? ARS.format(rate.costArs) : "—"}</dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-border text-base">
              <dt>Total</dt>
              <dd className="text-lg">{ARS.format(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={pending || !rate}
            className="mt-2 w-full bg-foreground text-background-cream px-8 py-4 text-[0.78rem] uppercase kerning-expanded hover:bg-cacao transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? "Procesando…" : "Confirmar y pagar"}
          </button>
          {error && (
            <p className="text-sm text-frutos-rojos mt-2">
              {error}
            </p>
          )}
          <p className="text-xs text-muted">
            Al confirmar te llevamos a Mercado Pago para completar el pago.
            Recibís email con el comprobante y seguimiento.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = false,
  value,
  onChange,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
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
        value={value}
        onChange={onChange}
        className="w-full border border-border bg-background-cream px-4 py-3 text-base focus:outline-none focus:border-foreground"
      />
      {hint && <span className="text-xs text-muted mt-1 block">{hint}</span>}
    </label>
  );
}
