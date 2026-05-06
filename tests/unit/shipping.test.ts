import { describe, it, expect } from "vitest";
import {
  postalCodeToZone,
  getShippingRate,
  ratesForZone,
  SHIPPING_RATES,
} from "@/lib/shipping";

describe("shipping", () => {
  describe("postalCodeToZone", () => {
    it("CABA postal codes (1xxx) → caba_gba", () => {
      expect(postalCodeToZone("1000")).toBe("caba_gba");
      expect(postalCodeToZone("1425")).toBe("caba_gba");
      expect(postalCodeToZone("1900")).toBe("caba_gba");
    });

    it("interior cercano (2xxx, 3xxx, 5xxx) → interior_chico", () => {
      expect(postalCodeToZone("2000")).toBe("interior_chico");
      expect(postalCodeToZone("3300")).toBe("interior_chico");
      expect(postalCodeToZone("5000")).toBe("interior_chico");
    });

    it("interior lejano (4xxx, 6xxx-9xxx) → interior_grande", () => {
      expect(postalCodeToZone("4000")).toBe("interior_grande");
      expect(postalCodeToZone("8400")).toBe("interior_grande");
      expect(postalCodeToZone("9410")).toBe("interior_grande");
    });

    it("acepta CPA con prefix de provincia (R8400ABC)", () => {
      expect(postalCodeToZone("R8400ABC")).toBe("interior_grande");
      expect(postalCodeToZone("C1425ABC")).toBe("caba_gba");
    });

    it("retorna null para inputs inválidos", () => {
      expect(postalCodeToZone("xx")).toBeNull();
      expect(postalCodeToZone("")).toBeNull();
      expect(postalCodeToZone("00")).toBeNull();
    });
  });

  describe("getShippingRate", () => {
    it("devuelve tarifa correcta para cada zona x carrier", () => {
      const r = getShippingRate("caba_gba", "andreani");
      expect(r.costArs).toBe(4900);
      expect(r.estimatedDays).toMatch(/\d+-\d+ días/);
    });

    it("interior lejano siempre cuesta más que CABA", () => {
      const carriers = ["andreani", "correo", "oca"] as const;
      for (const c of carriers) {
        const cabaRate = getShippingRate("caba_gba", c);
        const lejanoRate = getShippingRate("interior_grande", c);
        expect(lejanoRate.costArs).toBeGreaterThan(cabaRate.costArs);
      }
    });

    it("Correo es el más barato en cada zona", () => {
      const zones = ["caba_gba", "interior_chico", "interior_grande"] as const;
      for (const z of zones) {
        const correo = getShippingRate(z, "correo");
        const andreani = getShippingRate(z, "andreani");
        const oca = getShippingRate(z, "oca");
        expect(correo.costArs).toBeLessThan(andreani.costArs);
        expect(correo.costArs).toBeLessThan(oca.costArs);
      }
    });
  });

  describe("ratesForZone", () => {
    it("devuelve 3 tarifas (una por carrier) para cada zona", () => {
      expect(ratesForZone("caba_gba")).toHaveLength(3);
      expect(ratesForZone("interior_chico")).toHaveLength(3);
      expect(ratesForZone("interior_grande")).toHaveLength(3);
    });
  });

  describe("SHIPPING_RATES integrity", () => {
    it("no tiene duplicados de zone+carrier", () => {
      const seen = new Set<string>();
      for (const r of SHIPPING_RATES) {
        const key = `${r.zone}-${r.carrier}`;
        expect(seen.has(key), `duplicate ${key}`).toBe(false);
        seen.add(key);
      }
    });

    it("tiene 9 tarifas (3 zonas × 3 carriers)", () => {
      expect(SHIPPING_RATES).toHaveLength(9);
    });
  });
});
