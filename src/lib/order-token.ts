import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET debe estar configurado");
    }
    return "dev-secret-bosque-change-in-prod-please-min-32-chars";
  }
  return s;
}

/**
 * Genera un token HMAC ligado a la orden. Sin DB. La URL pública
 * `/checkout/exito?orderId=X&token=Y` solo es válida con el token correcto.
 * Previene IDOR: enumerar UUIDs de orders no expone datos de otras compras.
 */
export function makeOrderToken(orderId: string): string {
  return createHmac("sha256", getSecret())
    .update(`order-view:${orderId}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyOrderToken(orderId: string, token: string): boolean {
  if (!orderId || !token) return false;
  if (token.length !== 32) return false;
  const expected = makeOrderToken(orderId);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
