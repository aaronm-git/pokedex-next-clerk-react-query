import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeck, keydown, release } from "./deck.svelte";

type Init = KeyboardEventInit & { key: string };

/**
 * Dispatch a keydown from `from` through the window, the way a real key
 * travels, with the layout's handler listening there. Returns the event so
 * the test can ask whether it was claimed.
 */
function press(deck: ReturnType<typeof createDeck>, init: Init, from: Element) {
  const listener = (event: KeyboardEvent) => keydown(deck, event);
  window.addEventListener("keydown", listener);
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    ...init,
  });
  from.dispatchEvent(event);
  window.removeEventListener("keydown", listener);
  return event;
}

function mount(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.firstElementChild as HTMLElement;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("createDeck", () => {
  it("delivers presses to the newest listener and hands back on unsubscribe", () => {
    const deck = createDeck();
    const first = vi.fn();
    const second = vi.fn();

    deck.press("a");
    expect(first).not.toHaveBeenCalled();

    const stopFirst = deck.listen(first);
    deck.press("a");
    expect(first).toHaveBeenCalledWith("a");

    const stopSecond = deck.listen(second);
    deck.press("down");
    expect(second).toHaveBeenCalledWith("down");
    expect(first).toHaveBeenCalledTimes(1);

    stopSecond();
    deck.press("b");
    expect(first).toHaveBeenLastCalledWith("b");
    expect(second).toHaveBeenCalledTimes(1);

    stopFirst();
    deck.press("start");
    expect(first).toHaveBeenCalledTimes(2);
  });
});

describe("keydown", () => {
  it("claims a mapped key on the page body: prevents it, holds the button, presses it", () => {
    const deck = createDeck();
    const handler = vi.fn();
    deck.listen(handler);

    const event = press(deck, { key: "ArrowDown" }, document.body);

    expect(event.defaultPrevented).toBe(true);
    expect(deck.pressed).toBe("down");
    expect(handler).toHaveBeenCalledWith("down");
  });

  it("leaves unmapped keys alone, so Tab and browser shortcuts keep working", () => {
    const deck = createDeck();
    const handler = vi.fn();
    deck.listen(handler);

    const tab = press(deck, { key: "Tab" }, document.body);
    const letter = press(deck, { key: "a" }, document.body);
    const cmdLeft = press(
      deck,
      { key: "ArrowLeft", metaKey: true },
      document.body,
    );

    expect(tab.defaultPrevented).toBe(false);
    expect(letter.defaultPrevented).toBe(false);
    expect(cmdLeft.defaultPrevented).toBe(false);
    expect(deck.pressed).toBeNull();
    expect(handler).not.toHaveBeenCalled();
  });

  it("ignores every key while a text field has focus, without preventing it", () => {
    const deck = createDeck();
    const handler = vi.fn();
    deck.listen(handler);

    const fields = [
      mount('<input type="email">'),
      mount("<textarea></textarea>"),
      mount("<select><option>x</option></select>"),
      mount('<div contenteditable="true"></div>'),
      mount("<label><span>Email</span><input></label>").querySelector(
        "input",
      ) as HTMLElement,
    ];

    for (const field of fields) {
      for (const key of ["ArrowDown", "Enter", "Escape"]) {
        const event = press(deck, { key }, field);
        expect(event.defaultPrevented, `${key} in ${field.tagName}`).toBe(
          false,
        );
      }
    }
    expect(handler).not.toHaveBeenCalled();
    expect(deck.pressed).toBeNull();
  });

  it("does not treat a contenteditable=false element as typing", () => {
    const deck = createDeck();
    const handler = vi.fn();
    deck.listen(handler);
    const el = mount('<div contenteditable="false"></div>');

    press(deck, { key: "ArrowUp" }, el);
    expect(handler).toHaveBeenCalledWith("up");
  });

  it("stands aside for Enter on a focused link or button, but still owns the arrows there", () => {
    const deck = createDeck();
    const handler = vi.fn();
    deck.listen(handler);

    const link = mount('<a href="/search">Search</a>');
    const enter = press(deck, { key: "Enter" }, link);
    const shiftEnter = press(deck, { key: "Enter", shiftKey: true }, link);
    const arrow = press(deck, { key: "ArrowDown" }, link);
    const esc = press(deck, { key: "Escape" }, link);

    expect(enter.defaultPrevented).toBe(false);
    expect(shiftEnter.defaultPrevented).toBe(false);
    expect(arrow.defaultPrevented).toBe(true);
    expect(esc.defaultPrevented).toBe(true);
    expect(handler.mock.calls).toEqual([["down"], ["b"]]);

    handler.mockClear();
    const button = mount("<button>A</button>");
    const buttonEnter = press(deck, { key: "Enter" }, button);
    expect(buttonEnter.defaultPrevented).toBe(false);
    expect(handler).not.toHaveBeenCalled();

    // A placeholder link (no href) is not activatable, so Enter is ours.
    const dead = mount("<a>Disabled</a>");
    press(deck, { key: "Enter" }, dead);
    expect(handler).toHaveBeenCalledWith("a");
  });

  it("repeats a held arrow but not a held A or B", () => {
    const deck = createDeck();
    const handler = vi.fn();
    deck.listen(handler);

    press(deck, { key: "ArrowDown", repeat: true }, document.body);
    expect(handler).toHaveBeenCalledWith("down");

    handler.mockClear();
    const held = press(deck, { key: "Enter", repeat: true }, document.body);
    expect(held.defaultPrevented).toBe(true);
    expect(deck.pressed).toBe("a");
    expect(handler).not.toHaveBeenCalled();
  });
});

describe("release", () => {
  it("lets the on-screen button back up", () => {
    const deck = createDeck();
    press(deck, { key: "Escape" }, document.body);
    expect(deck.pressed).toBe("b");
    release(deck);
    expect(deck.pressed).toBeNull();
  });
});
