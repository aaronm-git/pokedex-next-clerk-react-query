import { describe, expect, it } from "vitest";
import { formatHeight, formatWeight, padNo } from "./format";

describe("padNo", () => {
  it("pads to three digits and leaves three-digit numbers alone", () => {
    expect(padNo(1)).toBe("001");
    expect(padNo(25)).toBe("025");
    expect(padNo(151)).toBe("151");
  });
});

describe("formatHeight", () => {
  it("matches the style guide: 7 dm is 2'04\"", () => {
    expect(formatHeight(7)).toBe(`2'04"`);
  });

  it("rolls inches into feet and pads a single inch", () => {
    expect(formatHeight(20)).toBe(`6'07"`);
    expect(formatHeight(4)).toBe(`1'04"`);
    expect(formatHeight(3)).toBe(`1'00"`);
  });
});

describe("formatWeight", () => {
  it("matches the style guide: 69 hg is 15.2 lb", () => {
    expect(formatWeight(69)).toBe("15.2 lb");
  });

  it("keeps one decimal, even when it is zero", () => {
    expect(formatWeight(4600)).toBe("1014.1 lb");
    expect(formatWeight(1)).toBe("0.2 lb");
  });
});
