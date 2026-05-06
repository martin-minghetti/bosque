import { describe, it, expect } from "vitest";
import { formatArs, formatBatch } from "@/lib/format";

describe("format", () => {
  it("formatArs con separador de miles AR", () => {
    expect(formatArs(8900)).toMatch(/8\.900/);
    expect(formatArs(99500)).toMatch(/99\.500/);
    expect(formatArs(128500)).toMatch(/128\.500/);
  });

  it("formatArs sin decimales por default (no termina con ,XX)", () => {
    expect(formatArs(8900.5)).not.toMatch(/,\d{2}$/);
  });

  it("formatBatch zero-pads a 3 dígitos", () => {
    expect(formatBatch(1, 220)).toBe("001 / 220");
    expect(formatBatch(14, 220)).toBe("014 / 220");
    expect(formatBatch(120, 220)).toBe("120 / 220");
  });
});
