import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "./paths";

const library = join(
  process.cwd(),
  "node_modules/@hackernoon/pixel-icon-library/icons/SVG",
);

// Every icon name is the library's own file name; only the variant folder
// differs. Find the source so the test can compare against it.
function sourceSvg(name: string): string {
  for (const variant of ["regular", "solid", "brands", "purcats"]) {
    const file = join(library, variant, `${name}.svg`);
    if (existsSync(file)) return readFileSync(file, "utf8");
  }
  throw new Error(`no source svg for ${name}`);
}

// Drawable elements the generator folds in: path, polygon and rect, minus
// the invisible fill="none" background rects some solid icons carry.
function drawableCount(svg: string): number {
  const tags = svg.match(/<(path|polygon|rect)\b[^>]*>/g) ?? [];
  return tags.filter((tag) => !tag.includes('fill="none"')).length;
}

describe("ICON_PATHS", () => {
  const entries = Object.entries(ICON_PATHS);

  it("has every path data non-empty and made of plain path commands", () => {
    for (const [name, d] of entries) {
      expect(d, name).toMatch(/^[MmLlHhVvZz0-9,\s.-]+$/);
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

  it("opens every folded source element with an absolute moveto", () => {
    // The generator joins several source elements into one string. A source
    // <path> may open with a relative "m", which the spec treats as absolute
    // only when it is the first command of the path. Once joined, it is no
    // longer first, so the generator must promote it to "M". Polygons and
    // rects always become "M...Z". Internal "Zm" subpaths inside one source
    // path are relative on purpose and stay lowercase, and no source path
    // in the library uses an internal uppercase "M", so the number of "M"
    // in the generated string must equal the number of drawable source
    // elements. A dropped promotion shows up as one "M" too few.
    for (const [name, d] of entries) {
      const expected = drawableCount(sourceSvg(name));
      const actual = (d.match(/M/g) ?? []).length;
      expect(actual, `${name}: absolute movetos`).toBe(expected);
    }
  });

  it("pins the two confirmed multi-path icons to their known-good output", () => {
    // grid is four <path> elements, user is two, each opening with "m".
    // These are the icons that shatter if a join is wrong.
    expect(ICON_PATHS.grid).toBe(
      "M10,13H2v1h-1v8h1v1h8v-1h1v-8h-1v-1Zm-1,8H3v-6h6v6ZM10,2v-1H2v1h-1v8h1v1h8v-1h1V2h-1Zm-7,7V3h6v6H3ZM22,13h-8v1h-1v8h1v1h8v-1h1v-8h-1v-1Zm-1,8h-6v-6h6v6ZM22,2v-1h-8v1h-1v8h1v1h8v-1h1V2h-1Zm-1,7h-6V3h6v6Z",
    );
    expect(ICON_PATHS.user).toBe(
      "M17,5v-2h-1v-1h-2v-1h-4v1h-2v1h-1v2h-1v4h1v2h1v1h2v1h4v-1h2v-1h1v-2h1v-4h-1Zm-2,4v1h-1v1h-4v-1h-1v-1h-1v-4h1v-1h1v-1h4v1h1v1h1v4h-1ZM21,19v-1h-1v-1h-1v-1h-2v-1H7v1h-2v1h-1v1h-1v1h-1v3h1v1h18v-1h1v-3h-1Zm-16,0v-1h2v-1h10v1h2v1h1v2H4v-2h1Z",
    );
  });
});
