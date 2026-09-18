import type { DeckButton } from "../device/deck";

// The slice of KeyboardEvent the mapping needs, so it can be tested in node
// without a DOM and called with a real event in the browser.
export type KeyChord = Pick<
  KeyboardEvent,
  "key" | "shiftKey" | "ctrlKey" | "metaKey" | "altKey"
>;

// Every key here is a non-printing key on purpose. WCAG 2.1.4 wants a
// printable-character shortcut (w, a, s, d, z, x) to be remappable or
// scoped to a focused component, because speech input and stray typing
// trigger it; arrows, Enter and Escape carry no such cost.
const PLAIN: Record<string, DeckButton> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Enter: "a",
  Escape: "b",
};

const SHIFTED: Record<string, DeckButton> = {
  Enter: "start",
};

/**
 * The deck button a key chord stands for, or null when the chord is not
 * ours. Ctrl, Meta and Alt chords are never ours: they belong to the browser
 * and the OS.
 */
export function buttonForKey(chord: KeyChord): DeckButton | null {
  if (chord.ctrlKey || chord.metaKey || chord.altKey) return null;
  const table = chord.shiftKey ? SHIFTED : PLAIN;
  return table[chord.key] ?? null;
}

export function isDirection(button: DeckButton | null): boolean {
  return (
    button === "up" ||
    button === "down" ||
    button === "left" ||
    button === "right"
  );
}

// Elements whose own keyboard handling must win over the deck: anything the
// user types into, and anything that consumes arrows natively.
const TYPING =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

// Elements the browser activates on Enter by itself. Our Enter must stand
// aside there, or a focused link fires twice: once natively, once as A.
const ACTIVATABLE =
  'a[href], button, summary, [role="button"], [role="link"], [role="tab"], [role="menuitem"]';

function closest(target: EventTarget | null, selector: string): boolean {
  return target instanceof Element && target.closest(selector) !== null;
}

export function isTypingTarget(target: EventTarget | null): boolean {
  return closest(target, TYPING);
}

export function isActivatableTarget(target: EventTarget | null): boolean {
  return closest(target, ACTIVATABLE);
}
