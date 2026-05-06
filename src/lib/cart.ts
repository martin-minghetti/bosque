import "server-only";
import { eq, and, sql } from "drizzle-orm";
import { db, cartItems, cartSessions, isDbConfigured } from "@/db";
import { readSessionId, writeSessionId } from "./session";
import { findProduct, type Product } from "@/data/products";

export type CartLine = {
  productSlug: string;
  product: Product;
  quantity: number;
  unitPriceArs: number;
  subtotalArs: number;
};

export type Cart = {
  sessionId: string | null;
  lines: CartLine[];
  itemCount: number;
  subtotalArs: number;
};

const EMPTY_CART: Cart = {
  sessionId: null,
  lines: [],
  itemCount: 0,
  subtotalArs: 0,
};

export async function readCart(): Promise<Cart> {
  if (!isDbConfigured) return EMPTY_CART;
  const sessionId = await readSessionId();
  if (!sessionId) return EMPTY_CART;

  const rows = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.sessionId, sessionId));

  const lines: CartLine[] = [];
  for (const row of rows) {
    const product = findProduct(row.productSlug ?? "");
    if (!product) continue;
    const unit = product.priceArs;
    lines.push({
      productSlug: product.slug,
      product,
      quantity: row.quantity,
      unitPriceArs: unit,
      subtotalArs: unit * row.quantity,
    });
  }
  // sort: most recently added first by no specific order; use product order
  lines.sort((a, b) => a.product.name.localeCompare(b.product.name));

  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);
  const subtotalArs = lines.reduce((s, l) => s + l.subtotalArs, 0);

  return { sessionId, lines, itemCount, subtotalArs };
}

async function ensureSession(): Promise<string> {
  let sessionId = await readSessionId();
  if (sessionId) {
    const existing = await db
      .select({ id: cartSessions.id })
      .from(cartSessions)
      .where(eq(cartSessions.id, sessionId))
      .limit(1);
    if (existing.length > 0) return sessionId;
  }
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const [row] = await db
    .insert(cartSessions)
    .values({ expiresAt })
    .returning({ id: cartSessions.id });
  sessionId = row.id;
  await writeSessionId(sessionId);
  return sessionId;
}

export async function addToCart(
  productSlug: string,
  quantity: number = 1,
): Promise<Cart> {
  if (!isDbConfigured) {
    throw new Error("DATABASE_URL no configurada — el carrito requiere DB");
  }
  if (quantity < 1 || !Number.isInteger(quantity)) {
    throw new Error("Cantidad inválida");
  }
  const product = findProduct(productSlug);
  if (!product) throw new Error("Producto no encontrado");
  if (!product.active) throw new Error("Producto no disponible");

  const sessionId = await ensureSession();

  // upsert: si existe, sumar; si no, insertar
  // usamos productSlug como source of truth (el productId en DB es separado)
  // pero como tenemos productSlug en cart_items, simplificamos.
  // NOTE: schema usa productId UUID. Para esta versión hardcoded, mapeamos
  // slug->productId via tabla products en DB. Por simplicidad: usamos slug
  // en una columna virtual del cart_items via productId interpreted as slug.
  // Para evitar fricción, almacenamos slug en una columna dedicada.
  // Refactor decision: cambiar schema a productSlug.
  // (Hecho en un patch posterior — por ahora asumo schema migrado.)

  await db
    .insert(cartItems)
    .values({
      sessionId,
      productSlug,
      quantity,
    })
    .onConflictDoUpdate({
      target: [cartItems.sessionId, cartItems.productSlug],
      set: {
        quantity: sql`${cartItems.quantity} + ${quantity}`,
        updatedAt: new Date(),
      },
    });

  return readCart();
}

export async function setCartLineQuantity(
  productSlug: string,
  quantity: number,
): Promise<Cart> {
  if (!isDbConfigured) throw new Error("DATABASE_URL no configurada");
  if (quantity < 0 || !Number.isInteger(quantity)) {
    throw new Error("Cantidad inválida");
  }

  const sessionId = await readSessionId();
  if (!sessionId) return EMPTY_CART;

  if (quantity === 0) {
    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.sessionId, sessionId),
          eq(cartItems.productSlug, productSlug),
        ),
      );
  } else {
    await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(
        and(
          eq(cartItems.sessionId, sessionId),
          eq(cartItems.productSlug, productSlug),
        ),
      );
  }

  return readCart();
}

export async function clearCart(): Promise<void> {
  if (!isDbConfigured) return;
  const sessionId = await readSessionId();
  if (!sessionId) return;
  await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
}
