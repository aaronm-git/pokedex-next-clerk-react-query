import type { DeckButton } from "../device/deck";

export type ListNavigation = {
  /**
   * The cursor. Always within 0..length-1 (0 when the list is empty), read
   * live, so a list that shrinks under the cursor pulls it back in bounds
   * without waiting for the next press.
   */
  index: number;
  /** Feed a deck button to the cursor. */
  handle(button: DeckButton): void;
  /** Select an item, the one under the cursor by default. */
  select(index?: number): void;
};

export type ListNavigationOptions = {
  /** Read live on every access so the cursor tracks the list it drives. */
  length: () => number;
  onselect?: (index: number) => void;
  onback?: () => void;
};

/**
 * The one owner of a screen's cursor. Menu and List take `index` as their
 * `activeIndex` and hand `onactivate` and `oncursor` back here; the deck
 * (on-screen or keyboard) feeds `handle`.
 *
 * Up and down move by one and stop at the ends. A selects, B goes back.
 * Left and right are reserved for paging; Start and Select are the
 * screen's own, so the screen wraps `handle` if it wants them.
 */
export function createListNavigation({
  length,
  onselect,
  onback,
}: ListNavigationOptions): ListNavigation {
  let raw = $state(0);

  const clamp = (i: number) =>
    Math.min(Math.max(0, i), Math.max(0, length() - 1));

  function select(index = clamp(raw)) {
    if (length() === 0) return;
    raw = clamp(index);
    onselect?.(raw);
  }

  return {
    get index() {
      return clamp(raw);
    },
    set index(i) {
      raw = clamp(i);
    },
    handle(button) {
      switch (button) {
        case "up":
          raw = clamp(clamp(raw) - 1);
          break;
        case "down":
          raw = clamp(clamp(raw) + 1);
          break;
        case "a":
          select();
          break;
        case "b":
          onback?.();
          break;
        default:
          break;
      }
    },
    select,
  };
}
