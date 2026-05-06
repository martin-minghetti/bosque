import { describe, it, expect, beforeAll } from "vitest";
import { makeOrderToken, verifyOrderToken } from "@/lib/order-token";

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-bosque-1234567890abcdef";
});

describe("order-token (IDOR guard)", () => {
  const orderId = "550e8400-e29b-41d4-a716-446655440000";

  it("token roundtrip válido", () => {
    const t = makeOrderToken(orderId);
    expect(t.length).toBe(32);
    expect(verifyOrderToken(orderId, t)).toBe(true);
  });

  it("rechaza token de otra orden", () => {
    const t = makeOrderToken(orderId);
    const otherOrder = "00000000-0000-0000-0000-000000000000";
    expect(verifyOrderToken(otherOrder, t)).toBe(false);
  });

  it("rechaza token alterado", () => {
    const t = makeOrderToken(orderId);
    const tampered = t.slice(0, -2) + "00";
    expect(verifyOrderToken(orderId, tampered)).toBe(false);
  });

  it("rechaza token vacío", () => {
    expect(verifyOrderToken(orderId, "")).toBe(false);
    expect(verifyOrderToken("", "abc")).toBe(false);
    expect(verifyOrderToken("", "")).toBe(false);
  });

  it("rechaza token de longitud incorrecta", () => {
    expect(verifyOrderToken(orderId, "short")).toBe(false);
    expect(verifyOrderToken(orderId, "x".repeat(64))).toBe(false);
  });

  it("misma orden produce mismo token (HMAC determinista)", () => {
    expect(makeOrderToken(orderId)).toBe(makeOrderToken(orderId));
  });

  it("órdenes distintas producen tokens distintos", () => {
    const a = makeOrderToken("orderA");
    const b = makeOrderToken("orderB");
    expect(a).not.toBe(b);
  });
});
