import { describe, expect, it } from "vitest";
import * as standard from "./+page";
import * as inverted from "./inverted/+page";

describe("styleguide routes", () => {
  it("prerenders both pages", () => {
    expect(standard.prerender).toBe(true);
    expect(inverted.prerender).toBe(true);
  });

  it("asks the shell for the inverted LCD on the twin only", () => {
    // The load function reads nothing from its event.
    const data = inverted.load({} as Parameters<typeof inverted.load>[0]);
    expect(data).toEqual({ inverted: true });
    expect("load" in standard).toBe(false);
  });
});
