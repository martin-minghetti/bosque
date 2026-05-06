import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/**
 * products: catálogo. Si la tabla está vacía o la DB no está configurada,
 * el demo cae al array hardcoded en `src/data/products.ts`. Admin (cuando
 * exista) escribe acá.
 */
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    shortName: text("short_name").notNull(),
    category: text("category").notNull(),
    description: text("description").notNull(),
    longDescription: text("long_description").notNull(),
    cocoaPercent: integer("cocoa_percent"),
    origin: text("origin").notNull(),
    originLabel: text("origin_label").notNull(),
    weightG: integer("weight_g").notNull(),
    priceArs: numeric("price_ars", { precision: 10, scale: 2 }).notNull(),
    stock: integer("stock").notNull().default(0),
    active: boolean("active").notNull().default(true),
    accentColor: text("accent_color").notNull(),
    heroGradient: text("hero_gradient").notNull(),
    flavorNotes: jsonb("flavor_notes").notNull().$type<string[]>(),
    pairings: jsonb("pairings").notNull().$type<string[]>(),
    contains: jsonb("contains").notNull().$type<string[]>(),
    batchSize: integer("batch_size").notNull(),
    batchNumber: integer("batch_number").notNull(),
    roastLevel: text("roast_level"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugUnique: uniqueIndex("products_slug_unique").on(table.slug),
    categoryIdx: index("products_category_idx").on(table.category),
    activeIdx: index("products_active_idx").on(table.active),
  }),
);

export const cartSessions = pgTable("cart_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

/**
 * cart_items: una línea por producto en el carrito de una sesión.
 * Usa productSlug como referencia (no FK a products.id) para que el demo
 * funcione con productos hardcoded sin depender del seed.
 */
export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => cartSessions.id, { onDelete: "cascade" }),
    productSlug: text("product_slug").notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sessionSlugUnique: uniqueIndex("cart_items_session_slug_unique").on(
      table.sessionId,
      table.productSlug,
    ),
    sessionIdx: index("cart_items_session_idx").on(table.sessionId),
  }),
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartSessionId: uuid("cart_session_id"),
    customerEmail: text("customer_email").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone"),
    shippingZone: text("shipping_zone").notNull(),
    shippingCarrier: text("shipping_carrier").notNull(),
    shippingAddress: text("shipping_address").notNull(),
    shippingCity: text("shipping_city").notNull(),
    shippingProvince: text("shipping_province").notNull(),
    shippingPostal: text("shipping_postal").notNull(),
    shippingCostArs: numeric("shipping_cost_ars", { precision: 10, scale: 2 })
      .notNull(),
    subtotalArs: numeric("subtotal_ars", { precision: 10, scale: 2 }).notNull(),
    totalArs: numeric("total_ars", { precision: 10, scale: 2 }).notNull(),
    status: text("status").notNull().default("pending"),
    mpPaymentId: text("mp_payment_id"),
    mpPreferenceId: text("mp_preference_id"),
    paymentMode: text("payment_mode").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (table) => ({
    statusIdx: index("orders_status_idx").on(table.status),
    emailIdx: index("orders_email_idx").on(table.customerEmail),
    createdIdx: index("orders_created_idx").on(table.createdAt),
  }),
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productSlug: text("product_slug").notNull(),
    productName: text("product_name").notNull(),
    quantity: integer("quantity").notNull(),
    unitPriceArs: numeric("unit_price_ars", { precision: 10, scale: 2 })
      .notNull(),
    subtotalArs: numeric("subtotal_ars", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => ({
    orderIdx: index("order_items_order_idx").on(table.orderId),
  }),
);

export type DBProduct = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type DBCartSession = typeof cartSessions.$inferSelect;
export type DBCartItem = typeof cartItems.$inferSelect;
export type DBOrder = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type DBOrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
