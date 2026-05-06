import "server-only";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE = "bosque_admin";

function getExpectedToken(): string | null {
  const t = process.env.ADMIN_TOKEN;
  if (!t || t.length < 8) return null;
  return t;
}

export async function isAdmin(): Promise<boolean> {
  const expected = getExpectedToken();
  if (!expected) return false;
  const c = await cookies();
  const got = c.get(ADMIN_COOKIE)?.value;
  if (!got) return false;
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function loginAdmin(token: string): Promise<boolean> {
  const expected = getExpectedToken();
  if (!expected) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  const c = await cookies();
  c.set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 días
  });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
}

export const ADMIN_TOKEN_CONFIGURED = Boolean(getExpectedToken());
