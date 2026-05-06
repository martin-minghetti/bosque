import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { Payment } from "mercadopago";
import { eq } from "drizzle-orm";
import { db, orders, orderItems, isDbConfigured } from "@/db";
import { mpClient } from "@/lib/mp";
import { sendOrderConfirmation } from "@/lib/email";

const MAX_AGE_SECONDS = 300; // 5 min

function verifyMpSignature(req: NextRequest, body: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[mp-webhook] MP_WEBHOOK_SECRET not set — rejecting");
    return false;
  }
  const xSignature = req.headers.get("x-signature") ?? "";
  const xRequestId = req.headers.get("x-request-id") ?? "";
  const tsMatch = xSignature.match(/ts=([^,]+)/);
  const v1Match = xSignature.match(/v1=([^,]+)/);
  if (!tsMatch || !v1Match) return false;

  const ts = tsMatch[1];
  const sig = v1Match[1];

  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return false;
  const ageSeconds = Math.floor(Date.now() / 1000) - Math.floor(tsNum / 1000);
  if (ageSeconds > MAX_AGE_SECONDS) {
    console.warn("[mp-webhook] timestamp too old", { ageSeconds });
    return false;
  }

  // dataId del query param (data.id según docs MP)
  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id") ?? "";

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return timingSafeEqual(sigBuf, expBuf);
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "DB not configured" }, { status: 503 });
  }

  const rawBody = await req.text();

  // En modo simulated o sin secret configurada, ignoramos webhooks reales
  if (!process.env.MP_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: true, ignored: "no secret configured" });
  }

  if (!verifyMpSignature(req, rawBody)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let payload: { type?: string; data?: { id?: string } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  if (payload.type !== "payment" || !payload.data?.id || !mpClient) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const paymentId = payload.data.id;
  const payment = await new Payment(mpClient).get({ id: paymentId });
  const externalRef = payment.external_reference;
  if (!externalRef) {
    return NextResponse.json({ ok: true, ignored: "no external_reference" });
  }

  const status = payment.status;
  const newStatus =
    status === "approved" ? "paid" : status === "rejected" ? "failed" : "pending";

  await db
    .update(orders)
    .set({
      status: newStatus,
      mpPaymentId: String(paymentId),
      paidAt: newStatus === "paid" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, externalRef));

  if (newStatus === "paid") {
    try {
      const [order] = await db.select().from(orders).where(eq(orders.id, externalRef));
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, externalRef));
      if (order) await sendOrderConfirmation(order, items);
    } catch (e) {
      console.error("[mp-webhook] email send failed", e);
    }
  }

  return NextResponse.json({ ok: true, status: newStatus });
}
