import { describe, it, expect, beforeAll } from "vitest";
import { packSignedSessionId, verifySignedSessionId } from "@/lib/session";

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-for-vitest-1234567890abcdef";
});

describe("session HMAC signing", () => {
  it("pack + verify roundtrip", () => {
    const sid = "550e8400-e29b-41d4-a716-446655440000";
    const packed = packSignedSessionId(sid);
    expect(packed.split(".")).toHaveLength(2);
    expect(verifySignedSessionId(packed)).toBe(sid);
  });

  it("rechaza signature alterada", () => {
    const sid = "550e8400-e29b-41d4-a716-446655440000";
    const packed = packSignedSessionId(sid);
    const tampered = packed.slice(0, -2) + "00";
    expect(verifySignedSessionId(tampered)).toBeNull();
  });

  it("rechaza session_id alterado (signature ya no matchea)", () => {
    const sid = "550e8400-e29b-41d4-a716-446655440000";
    const packed = packSignedSessionId(sid);
    const [, sig] = packed.split(".");
    const evil = `00000000-0000-0000-0000-000000000000.${sig}`;
    expect(verifySignedSessionId(evil)).toBeNull();
  });

  it("rechaza formato sin punto", () => {
    expect(verifySignedSessionId("nodot")).toBeNull();
    expect(verifySignedSessionId("")).toBeNull();
  });

  it("dos packs del mismo sid producen el mismo output (HMAC determinista)", () => {
    const sid = "abc";
    expect(packSignedSessionId(sid)).toBe(packSignedSessionId(sid));
  });
});
