export type ShippingZone = "caba_gba" | "interior_chico" | "interior_grande";
export type ShippingCarrier = "andreani" | "correo" | "oca";

export const SHIPPING_ZONES: { slug: ShippingZone; label: string; provinces: string[] }[] = [
  {
    slug: "caba_gba",
    label: "CABA + GBA",
    provinces: ["CABA", "Buenos Aires (GBA)"],
  },
  {
    slug: "interior_chico",
    label: "Interior cercano",
    provinces: [
      "Buenos Aires (interior)",
      "Córdoba",
      "Santa Fe",
      "Entre Ríos",
      "La Pampa",
    ],
  },
  {
    slug: "interior_grande",
    label: "Interior lejano",
    provinces: [
      "Mendoza",
      "Tucumán",
      "Salta",
      "Jujuy",
      "Misiones",
      "Corrientes",
      "Chaco",
      "Formosa",
      "Santiago del Estero",
      "La Rioja",
      "Catamarca",
      "San Juan",
      "San Luis",
      "Neuquén",
      "Río Negro",
      "Chubut",
      "Santa Cruz",
      "Tierra del Fuego",
    ],
  },
];

type RateRow = {
  zone: ShippingZone;
  carrier: ShippingCarrier;
  costArs: number;
  estimatedDays: string;
};

export const SHIPPING_RATES: RateRow[] = [
  // Andreani
  { zone: "caba_gba", carrier: "andreani", costArs: 4900, estimatedDays: "3-5 días hábiles" },
  { zone: "interior_chico", carrier: "andreani", costArs: 6800, estimatedDays: "4-7 días hábiles" },
  { zone: "interior_grande", carrier: "andreani", costArs: 9200, estimatedDays: "5-9 días hábiles" },
  // Correo Argentino
  { zone: "caba_gba", carrier: "correo", costArs: 3800, estimatedDays: "5-8 días hábiles" },
  { zone: "interior_chico", carrier: "correo", costArs: 5400, estimatedDays: "6-10 días hábiles" },
  { zone: "interior_grande", carrier: "correo", costArs: 7600, estimatedDays: "8-14 días hábiles" },
  // OCA
  { zone: "caba_gba", carrier: "oca", costArs: 5200, estimatedDays: "2-4 días hábiles" },
  { zone: "interior_chico", carrier: "oca", costArs: 7400, estimatedDays: "3-6 días hábiles" },
  { zone: "interior_grande", carrier: "oca", costArs: 9900, estimatedDays: "5-8 días hábiles" },
];

export const CARRIER_LABEL: Record<ShippingCarrier, string> = {
  andreani: "Andreani",
  correo: "Correo Argentino",
  oca: "OCA",
};

export function getShippingRate(
  zone: ShippingZone,
  carrier: ShippingCarrier,
): RateRow {
  const rate = SHIPPING_RATES.find((r) => r.zone === zone && r.carrier === carrier);
  if (!rate) throw new Error(`Tarifa no encontrada para ${zone} + ${carrier}`);
  return rate;
}

export function ratesForZone(zone: ShippingZone): RateRow[] {
  return SHIPPING_RATES.filter((r) => r.zone === zone);
}

const POSTAL_PREFIX_TO_ZONE: { regex: RegExp; zone: ShippingZone }[] = [
  // CABA + GBA: códigos 1xxx
  { regex: /^1[0-9]{3}/, zone: "caba_gba" },
  // Interior chico: 2xxx (BA interior), 3xxx (Litoral), 5xxx (Cuyo medio + Cba)
  { regex: /^[235][0-9]{3}/, zone: "interior_chico" },
  // Interior grande: 4xxx (NOA), 6xxx-9xxx (Patagonia + NOA + Cuyo lejano)
  { regex: /^[4-9][0-9]{3}/, zone: "interior_grande" },
];

export function postalCodeToZone(cp: string): ShippingZone | null {
  const clean = cp.trim().toUpperCase();
  for (const { regex, zone } of POSTAL_PREFIX_TO_ZONE) {
    if (regex.test(clean)) return zone;
  }
  return null;
}
