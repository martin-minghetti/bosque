const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatArs(amount: number): string {
  return ARS.format(amount);
}

export function formatBatch(num: number, total: number): string {
  return `${String(num).padStart(3, "0")} / ${total}`;
}
