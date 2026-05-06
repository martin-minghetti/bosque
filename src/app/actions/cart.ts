"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import {
  addToCart as addToCartLib,
  setCartLineQuantity,
  clearCart,
} from "@/lib/cart";
import { rateLimit, maybeCleanup } from "@/lib/rate-limit";

async function checkRate(scope: string, limit: number, windowMs: number) {
  maybeCleanup();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return rateLimit(`${scope}:${ip}`, limit, windowMs);
}

const addSchema = z.object({
  slug: z.string().min(1).max(120),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
});

const setSchema = z.object({
  slug: z.string().min(1).max(120),
  quantity: z.coerce.number().int().min(0).max(20),
});

export async function addToCartAndRedirect(formData: FormData): Promise<void> {
  const rl = await checkRate("add-cart", 60, 60_000);
  if (!rl.ok) redirect("/tienda?error=ratelimit");
  const parsed = addSchema.safeParse({
    slug: formData.get("slug"),
    quantity: formData.get("quantity"),
  });
  if (!parsed.success) redirect("/tienda");
  await addToCartLib(parsed.data.slug, parsed.data.quantity);
  revalidatePath("/", "layout");
  redirect("/carrito");
}

export async function setCartLineAction(formData: FormData): Promise<void> {
  const parsed = setSchema.safeParse({
    slug: formData.get("slug"),
    quantity: formData.get("quantity"),
  });
  if (!parsed.success) return;
  try {
    await setCartLineQuantity(parsed.data.slug, parsed.data.quantity);
    revalidatePath("/", "layout");
  } catch (e) {
    console.error("[setCartLineAction]", e);
  }
}

export async function clearCartAction(): Promise<void> {
  try {
    await clearCart();
    revalidatePath("/", "layout");
  } catch (e) {
    console.error("[clearCartAction]", e);
  }
}
