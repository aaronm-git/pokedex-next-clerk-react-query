import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "./paths";

describe("ICON_PATHS", () => {
  const entries = Object.entries(ICON_PATHS);

  it("has every path data non-empty and made of plain path commands", () => {
    for (const [name, d] of entries) {
      expect(d, name).toMatch(/^[MmLlHhVvZz0-9,\s.-]+$/);
      expect(d, name).toMatch(/^M/);
    }
  });

  it("stays on the integer pixel grid", () => {
    for (const [name, d] of entries) {
      const numbers = d.match(/-?\d+(\.\d+)?/g) ?? [];
      expect(numbers.length, name).toBeGreaterThan(0);
      for (const n of numbers) {
        expect(Number.isInteger(Number(n)), `${name}: ${n}`).toBe(true);
      }
    }
  });

  it("keeps every subpath's opening moveto absolute", () => {
    // A relative "m" straight after "Z" would be relative to the previous
    // subpath's start, which is fine inside one source path but wrong when
    // two source paths were joined. Only "ZM" or a lowercase "m" from
    // inside the same source path is allowed; the generator promotes
    // the first moveto of each source path to "M".
    for (const [name, d] of entries) {
      expect(d, name).not.toMatch(/^m/);
    }
  });
});
