import { createContext } from "svelte";
import type { DeckButton } from "../device/deck";
import {
  buttonForKey,
  isActivatableTarget,
  isDirection,
  isTypingTarget,
} from "./keys";

export type DeckHandler = (button: DeckButton) => void;

export type Deck = {
  /** The button a held key is holding down, so the on-screen deck can show it. */
  pressed: DeckButton | null;
  /** Deliver a press to whichever screen owns the deck right now. */
  press: DeckHandler;
  /**
   * Take the deck. The newest listener receives presses; unsubscribing hands
   * the deck back to the one before it, so a page layered over another does
   * not need to know what it covered.
   */
  listen(handler: DeckHandler): () => void;
};

export function createDeck(): Deck {
  let pressed = $state<DeckButton | null>(null);
  // A plain array: listeners are not rendered, so nothing needs to react to
  // them changing.
  const listeners: DeckHandler[] = [];

  return {
    get pressed() {
      return pressed;
    },
    set pressed(button) {
      pressed = button;
    },
    press(button) {
      listeners.at(-1)?.(button);
    },
    listen(handler) {
      listeners.push(handler);
      return () => {
        const at = listeners.lastIndexOf(handler);
        if (at >= 0) listeners.splice(at, 1);
      };
    },
  };
}

const [getDeck, setDeck] = createContext<Deck>();
export { getDeck, setDeck };

/**
 * Own the deck for as long as the calling component is mounted. Call it
 * during component init, like any context read.
 */
export function onDeck(handler: DeckHandler): void {
  const deck = getDeck();
  $effect(() => deck.listen(handler));
}

/**
 * The window keydown handler. It claims a key only when the key is ours and
 * nothing more specific wants it, and it calls preventDefault only then, so
 * Tab, browser shortcuts and typing keep working.
 */
export function keydown(deck: Deck, event: KeyboardEvent): void {
  // Someone is typing, or using a control that owns its arrows.
  if (isTypingTarget(event.target)) return;

  const button = buttonForKey(event);
  if (button === null) return;

  // Enter on a focused link or button already activates it natively. Firing
  // A as well would select twice, so A stands aside there. The arrows do not:
  // the cursor is ours even when its item has focus.
  if (
    (button === "a" || button === "start") &&
    isActivatableTarget(event.target)
  ) {
    return;
  }

  event.preventDefault();
  deck.pressed = button;

  // A held arrow repeats, like a real D-pad. A held A or B must not select
  // or back out again and again.
  if (event.repeat && !isDirection(button)) return;
  deck.press(button);
}

/** The window keyup and blur handler: the on-screen button comes back up. */
export function release(deck: Deck): void {
  deck.pressed = null;
}
