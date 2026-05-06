import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("permite hasta el límite", () => {
    const k = `test-allow-${Date.now()}`;
    expect(rateLimit(k, 3, 60_000).ok).toBe(true);
    expect(rateLimit(k, 3, 60_000).ok).toBe(true);
    expect(rateLimit(k, 3, 60_000).ok).toBe(true);
  });

  it("bloquea pasado el límite", () => {
    const k = `test-block-${Date.now()}`;
    rateLimit(k, 2, 60_000);
    rateLimit(k, 2, 60_000);
    const r = rateLimit(k, 2, 60_000);
    expect(r.ok).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it("buckets independientes por key", () => {
    const a = `test-iso-a-${Date.now()}`;
    const b = `test-iso-b-${Date.now()}`;
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).ok).toBe(false);
    expect(rateLimit(b, 1, 60_000).ok).toBe(true);
  });

  it("ventana corta resetea", async () => {
    const k = `test-reset-${Date.now()}`;
    rateLimit(k, 1, 50);
    expect(rateLimit(k, 1, 50).ok).toBe(false);
    await new Promise((r) => setTimeout(r, 70));
    expect(rateLimit(k, 1, 50).ok).toBe(true);
  });

  it("retorna remaining decreciente", () => {
    const k = `test-rem-${Date.now()}`;
    expect(rateLimit(k, 5, 60_000).remaining).toBe(4);
    expect(rateLimit(k, 5, 60_000).remaining).toBe(3);
    expect(rateLimit(k, 5, 60_000).remaining).toBe(2);
  });
});
