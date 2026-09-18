import { describe, expect, it } from "vitest";
import { buttonForKey, isDirection, type KeyChord } from "./keys";

const chord = (key: string, mods: Partial<KeyChord> = {}): KeyChord => ({
  key,
  shiftKey: false,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  ...mods,
});

describe("buttonForKey", () => {
  it("maps the arrows to the D-pad", () => {
    expect(buttonForKey(chord("ArrowUp"))).toBe("up");
    expect(buttonForKey(chord("ArrowDown"))).toBe("down");
    expect(buttonForKey(chord("ArrowLeft"))).toBe("left");
    expect(buttonForKey(chord("ArrowRight"))).toBe("right");
  });

  it("maps Enter to A, Escape to B and Shift+Enter to Start", () => {
    expect(buttonForKey(chord("Enter"))).toBe("a");
    expect(buttonForKey(chord("Escape"))).toBe("b");
    expect(buttonForKey(chord("Enter", { shiftKey: true }))).toBe("start");
  });

  it("owns no printable character, so typing and speech input cannot press the deck", () => {
    for (const key of ["w", "a", "s", "d", "z", "x", " ", "1"]) {
      expect(buttonForKey(chord(key))).toBeNull();
    }
  });

  it("leaves browser chords alone", () => {
    expect(buttonForKey(chord("ArrowLeft", { metaKey: true }))).toBeNull();
    expect(buttonForKey(chord("ArrowLeft", { altKey: true }))).toBeNull();
    expect(buttonForKey(chord("Enter", { ctrlKey: true }))).toBeNull();
    expect(buttonForKey(chord("Escape", { shiftKey: true }))).toBeNull();
    expect(buttonForKey(chord("Tab"))).toBeNull();
  });
});

describe("isDirection", () => {
  it("is true for the four D-pad arms only", () => {
    expect(isDirection("up")).toBe(true);
    expect(isDirection("right")).toBe(true);
    expect(isDirection("a")).toBe(false);
    expect(isDirection("start")).toBe(false);
    expect(isDirection(null)).toBe(false);
  });
});
