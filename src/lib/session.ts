import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "bosque_sid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set (min 16 chars) in production");
    }
    return "dev-secret-bosque-change-in-prod-please-min-32-chars";
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export type SignedSessionId = string;

export function packSignedSessionId(sessionId: string): SignedSessionId {
  const sig = sign(sessionId);
  return `${sessionId}.${sig}`;
}

export function verifySignedSessionId(packed: string): string | null {
  const [sessionId, sig] = packed.split(".");
  if (!sessionId || !sig) return null;
  const expected = sign(sessionId);
  if (!safeEqual(sig, expected)) return null;
  return sessionId;
}

export async function readSessionId(): Promise<string | null> {
  const c = await cookies();
  const raw = c.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  return verifySignedSessionId(raw);
}

export async function writeSessionId(sessionId: string): Promise<void> {
  const c = await cookies();
  c.set(SESSION_COOKIE, packSignedSessionId(sessionId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
