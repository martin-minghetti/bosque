import { describe, it, expect } from "vitest";
import {
  PRODUCTS,
  CATEGORIES,
  findProduct,
  productsByCategory,
  activeProducts,
} from "@/data/products";

describe("products data", () => {
  it("12 productos en total", () => {
    expect(PRODUCTS).toHaveLength(12);
  });

  it("todos los slugs son únicos", () => {
    const slugs = new Set(PRODUCTS.map((p) => p.slug));
    expect(slugs.size).toBe(PRODUCTS.length);
  });

  it("todos los slugs son kebab-case válidos", () => {
    for (const p of PRODUCTS) {
      expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("todos los productos tienen categoría válida", () => {
    const cats = new Set(CATEGORIES.map((c) => c.slug));
    for (const p of PRODUCTS) {
      expect(cats.has(p.category)).toBe(true);
    }
  });

  it("precios en rango razonable AR (>$5k, <$100k)", () => {
    for (const p of PRODUCTS) {
      expect(p.priceArs).toBeGreaterThan(5000);
      expect(p.priceArs).toBeLessThan(100_000);
    }
  });

  it("stock no negativo", () => {
    for (const p of PRODUCTS) {
      expect(p.stock).toBeGreaterThanOrEqual(0);
    }
  });

  it("findProduct devuelve undefined para slug inexistente", () => {
    expect(findProduct("no-existe")).toBeUndefined();
  });

  it("findProduct devuelve el producto correcto", () => {
    const p = findProduct("frutos-rojos-70");
    expect(p?.shortName).toBe("Frutos rojos");
  });

  it("productsByCategory filtra correctamente", () => {
    const tabletas = productsByCategory("tabletas");
    expect(tabletas.length).toBeGreaterThan(0);
    expect(tabletas.every((p) => p.category === "tabletas")).toBe(true);
  });

  it("activeProducts excluye inactivos", () => {
    const all = PRODUCTS.length;
    const active = activeProducts().length;
    expect(active).toBeLessThanOrEqual(all);
    expect(activeProducts().every((p) => p.active)).toBe(true);
  });

  it("flavorNotes y pairings nunca vacíos", () => {
    for (const p of PRODUCTS) {
      expect(p.flavorNotes.length).toBeGreaterThan(0);
      expect(p.pairings.length).toBeGreaterThan(0);
    }
  });
});
