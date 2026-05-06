import "server-only";
import { Resend } from "resend";
import { CARRIER_LABEL } from "./shipping";
import type { DBOrder, DBOrderItem } from "@/db";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM ?? "Bosque <hola@bosque.example>";

const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const resend = apiKey ? new Resend(apiKey) : null;

export async function sendOrderConfirmation(
  order: DBOrder,
  items: DBOrderItem[],
): Promise<{ ok: boolean; reason?: string }> {
  if (!resend) {
    return { ok: false, reason: "RESEND_API_KEY no configurada" };
  }

  const itemsList = items
    .map(
      (it) =>
        `<tr><td style="padding:8px 0">${it.productName} × ${it.quantity}</td><td style="padding:8px 0;text-align:right;font-family:ui-monospace,monospace">${ARS.format(Number(it.subtotalArs))}</td></tr>`,
    )
    .join("");

  const carrierLabel =
    CARRIER_LABEL[order.shippingCarrier as keyof typeof CARRIER_LABEL] ?? order.shippingCarrier;

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:Helvetica,Arial,sans-serif;background:#FBFAF3;color:#0A0A0A;padding:40px;margin:0">
  <div style="max-width:560px;margin:0 auto;background:#FFFFFF;padding:40px;border:1px solid #D9D2C4">
    <h1 style="font-family:'Antonio',sans-serif;font-size:32px;letter-spacing:-0.02em;text-transform:uppercase;line-height:1;margin:0">
      Bosque
    </h1>
    <p style="color:#5A544A;text-transform:uppercase;letter-spacing:0.18em;font-size:11px;margin:24px 0 4px">
      Orden #${order.id.slice(0, 8)}
    </p>
    <h2 style="font-size:24px;margin:8px 0 24px">Gracias, ${order.customerName.split(" ")[0]}.</h2>
    <p style="color:#0A0A0A;line-height:1.6">
      Recibimos tu compra. Te enviamos un mail con el seguimiento cuando despachemos
      el paquete con ${carrierLabel}.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0;border-top:1px solid #D9D2C4;border-bottom:1px solid #D9D2C4">
      ${itemsList}
    </table>
    <table style="width:100%;font-family:ui-monospace,monospace;font-size:14px">
      <tr><td style="color:#5A544A">Subtotal</td><td style="text-align:right">${ARS.format(Number(order.subtotalArs))}</td></tr>
      <tr><td style="color:#5A544A">Envío · ${carrierLabel}</td><td style="text-align:right">${ARS.format(Number(order.shippingCostArs))}</td></tr>
      <tr style="border-top:1px solid #D9D2C4"><td style="padding-top:8px">Total</td><td style="text-align:right;padding-top:8px">${ARS.format(Number(order.totalArs))}</td></tr>
    </table>
    <p style="color:#5A544A;font-size:13px;line-height:1.6;margin-top:32px">
      Envío a:<br/>
      ${order.shippingAddress}<br/>
      ${order.shippingCity}, ${order.shippingProvince} (${order.shippingPostal})
    </p>
    <p style="color:#5A544A;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;margin-top:48px">
      Bosque · Bariloche · Patagonia
    </p>
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from,
      to: order.customerEmail,
      subject: `Tu compra en Bosque (#${order.id.slice(0, 8)})`,
      html,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "Resend error" };
  }
}
