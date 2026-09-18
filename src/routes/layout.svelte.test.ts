import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { onDeck } from "$lib/components/nav/deck.svelte";
import Layout from "./+layout.svelte";

// A screen: a text field and a link, plus a deck listener registered the
// way a real page does it. The raw snippet's setup runs inside the layout's
// render tree, so context and effects resolve as they would for a page.
function screenWith(handler: (button: string) => void) {
  return createRawSnippet(() => ({
    render: () => `
      <div class="dex-screen-body">
        <label>Email <input type="email"></label>
        <a href="/search">Search</a>
      </div>`,
    setup: () => {
      onDeck(handler);
    },
  }));
}

function keydown(target: Element, init: KeyboardEventInit) {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    ...init,
  });
  target.dispatchEvent(event);
  return event;
}

describe("root layout", () => {
  it("presses the on-screen deck from the keyboard, holding it until keyup", async () => {
    const handler = vi.fn();
    const { container } = render(Layout, {
      props: { children: screenWith(handler) },
    });
    const dpad = container.querySelector(".gb-dpad") as HTMLElement;

    const event = keydown(document.body, { key: "ArrowDown" });
    await Promise.resolve();
    expect(event.defaultPrevented).toBe(true);
    expect(dpad).toHaveClass("is-pressed");
    expect(handler).toHaveBeenCalledWith("down");

    document.body.dispatchEvent(
      new KeyboardEvent("keyup", { key: "ArrowDown", bubbles: true }),
    );
    await Promise.resolve();
    expect(dpad).not.toHaveClass("is-pressed");
  });

  it("lets go of a held button when the window loses focus", async () => {
    const { container } = render(Layout, {
      props: { children: screenWith(() => {}) },
    });
    const a = container.querySelector(".gb-ab__btn:not(.gb-ab__btn--b)");

    keydown(document.body, { key: "Enter" });
    await Promise.resolve();
    expect(a).toHaveClass("is-pressed");

    window.dispatchEvent(new FocusEvent("blur"));
    await Promise.resolve();
    expect(a).not.toHaveClass("is-pressed");
  });

  it("ignores keys typed into a text field", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    const { container } = render(Layout, {
      props: { children: screenWith(handler) },
    });
    const field = container.querySelector("input") as HTMLInputElement;

    await user.click(field);
    await user.keyboard("a@b.c{ArrowLeft}{Enter}{Escape}");

    expect(field.value).toBe("a@b.c");
    expect(handler).not.toHaveBeenCalled();
    expect(container.querySelector(".is-pressed")).toBeNull();
  });

  it("does not claim Tab, so every control stays reachable", async () => {
    const user = userEvent.setup();
    const { container } = render(Layout, {
      props: { children: screenWith(() => {}) },
    });

    const stops: Element[] = [];
    for (let i = 0; i < 10; i += 1) {
      await user.tab();
      if (document.activeElement) stops.push(document.activeElement);
    }
    expect(stops).toContain(container.querySelector("input"));
    expect(stops).toContain(container.querySelector("a[href]"));
    for (const name of [
      "Up",
      "Down",
      "Left",
      "Right",
      "B",
      "A",
      "Select",
      "Start",
    ]) {
      expect(stops).toContain(
        container.querySelector(`button[aria-label="${name}"]`),
      );
    }
  });

  it("leaves Enter to a focused link and does not press A as well", async () => {
    const handler = vi.fn();
    const { container } = render(Layout, {
      props: { children: screenWith(handler) },
    });
    const link = container.querySelector("a[href]") as HTMLAnchorElement;
    link.focus();

    const event = keydown(link, { key: "Enter" });
    expect(event.defaultPrevented).toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });

  it("hands the deck to the newest screen and back when it unmounts", async () => {
    const handler = vi.fn();
    const { unmount } = render(Layout, {
      props: { children: screenWith(handler) },
    });

    keydown(document.body, { key: "Escape" });
    expect(handler).toHaveBeenCalledWith("b");

    unmount();
    handler.mockClear();
    keydown(document.body, { key: "Escape" });
    expect(handler).not.toHaveBeenCalled();
  });

  it("routes an on-screen press through the same handler as the keyboard", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    const { container } = render(Layout, {
      props: { children: screenWith(handler) },
    });

    await user.click(
      container.querySelector('button[aria-label="Up"]') as HTMLElement,
    );
    expect(handler).toHaveBeenCalledWith("up");
  });
});
