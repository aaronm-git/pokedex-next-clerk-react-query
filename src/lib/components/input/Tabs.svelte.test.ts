import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Tabs from "./Tabs.svelte";

const tabs = ["Data", "Stats", "Moves"];

// The snippet parameter arrives as a getter.
const panel = createRawSnippet((i: () => number) => ({
  render: () => `<p>panel ${i()}</p>`,
}));

const tabEls = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[role="tab"]'));

describe("Tabs", () => {
  it("renders a tablist of tab buttons with exactly one selected", () => {
    const { container } = render(Tabs, { props: { tabs, activeIndex: 1 } });

    expect(container.children).toHaveLength(1);
    const list = container.firstElementChild as HTMLElement;
    expect(list.tagName).toBe("DIV");
    expect(list).toHaveAttribute("role", "tablist");
    expect(list).toHaveClass("dex-tabs");

    const els = tabEls(list);
    expect(els).toHaveLength(3);
    for (const el of els) {
      expect(el.tagName).toBe("BUTTON");
      expect(el).toHaveAttribute("type", "button");
      expect(el).toHaveClass("dex-tabs__tab");
      expect(el).toHaveAttribute("id");
    }
    expect(els[0]).toHaveAttribute("aria-selected", "false");
    expect(els[1]).toHaveAttribute("aria-selected", "true");
    expect(els[2]).toHaveAttribute("aria-selected", "false");
    expect(els[1]).toHaveTextContent("Stats");
  });

  it("uses a roving tabindex so Tab lands on the active tab, not the first", async () => {
    const user = userEvent.setup();
    const { container } = render(Tabs, { props: { tabs, activeIndex: 2 } });

    const els = tabEls(container);
    expect(els[0]).toHaveAttribute("tabindex", "-1");
    expect(els[1]).toHaveAttribute("tabindex", "-1");
    expect(els[2]).toHaveAttribute("tabindex", "0");

    await user.tab();
    expect(document.activeElement).toBe(els[2]);
  });

  it("moves selection and focus with the arrow keys, wrapping at both ends", async () => {
    const user = userEvent.setup();
    const onactivate = vi.fn();
    const { container, rerender } = render(Tabs, {
      props: { tabs, activeIndex: 0, onactivate },
    });

    await user.tab();
    expect(document.activeElement).toBe(tabEls(container)[0]);

    await user.keyboard("{ArrowRight}");
    expect(onactivate).toHaveBeenLastCalledWith(1);
    expect(document.activeElement).toBe(tabEls(container)[1]);

    // The parent owns activeIndex; emulate it responding.
    await rerender({ tabs, activeIndex: 1, onactivate });
    await user.keyboard("{ArrowDown}");
    expect(onactivate).toHaveBeenLastCalledWith(2);
    expect(document.activeElement).toBe(tabEls(container)[2]);

    await rerender({ tabs, activeIndex: 2, onactivate });
    await user.keyboard("{ArrowRight}");
    expect(onactivate).toHaveBeenLastCalledWith(0);
    expect(document.activeElement).toBe(tabEls(container)[0]);

    await rerender({ tabs, activeIndex: 0, onactivate });
    await user.keyboard("{ArrowLeft}");
    expect(onactivate).toHaveBeenLastCalledWith(2);
    expect(document.activeElement).toBe(tabEls(container)[2]);

    await rerender({ tabs, activeIndex: 2, onactivate });
    await user.keyboard("{ArrowUp}");
    expect(onactivate).toHaveBeenLastCalledWith(1);
    expect(document.activeElement).toBe(tabEls(container)[1]);

    expect(onactivate).toHaveBeenCalledTimes(5);
  });

  it("jumps to the first and last tab with Home and End", async () => {
    const user = userEvent.setup();
    const onactivate = vi.fn();
    const { container, rerender } = render(Tabs, {
      props: { tabs, activeIndex: 1, onactivate },
    });

    await user.tab();
    await user.keyboard("{End}");
    expect(onactivate).toHaveBeenLastCalledWith(2);
    expect(document.activeElement).toBe(tabEls(container)[2]);

    await rerender({ tabs, activeIndex: 2, onactivate });
    await user.keyboard("{Home}");
    expect(onactivate).toHaveBeenLastCalledWith(0);
    expect(document.activeElement).toBe(tabEls(container)[0]);
  });

  it("stops handled arrow keys from reaching the window and ignores other keys", async () => {
    const user = userEvent.setup();
    const onactivate = vi.fn();
    const windowHandler = vi.fn();
    window.addEventListener("keydown", windowHandler);
    render(Tabs, { props: { tabs, activeIndex: 0, onactivate } });

    await user.tab();
    // The Tab keystroke itself reaches the window; only the arrow must not.
    windowHandler.mockClear();
    await user.keyboard("{ArrowRight}");
    expect(windowHandler).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");
    expect(windowHandler).toHaveBeenCalledTimes(1);
    // Once for the arrow, once because Enter clicks the focused tab button.
    expect(onactivate).toHaveBeenCalledTimes(2);
    expect(onactivate).toHaveBeenLastCalledWith(1);

    window.removeEventListener("keydown", windowHandler);
  });

  it("calls onactivate with the clicked index", async () => {
    const user = userEvent.setup();
    const onactivate = vi.fn();
    const { container } = render(Tabs, {
      props: { tabs, activeIndex: 0, onactivate },
    });

    await user.click(tabEls(container)[2]);
    expect(onactivate).toHaveBeenCalledTimes(1);
    expect(onactivate).toHaveBeenCalledWith(2);
  });

  it("renders one tabpanel wired to every tab when panel is given", () => {
    const { container } = render(Tabs, {
      props: { tabs, activeIndex: 1, panel },
    });

    expect(container.children).toHaveLength(2);
    const panels = container.querySelectorAll('[role="tabpanel"]');
    expect(panels).toHaveLength(1);
    const el = panels[0] as HTMLElement;
    expect(el).toHaveClass("dex-tabpanel");
    expect(el).toHaveAttribute("tabindex", "0");
    expect(el.previousElementSibling).toHaveAttribute("role", "tablist");
    expect(el).toHaveTextContent("panel 1");

    const els = tabEls(container);
    for (const tab of els) {
      expect(tab).toHaveAttribute("aria-controls", el.id);
    }
    expect(el).toHaveAttribute("aria-labelledby", els[1].id);
    expect(els[1].id).not.toBe(els[0].id);
  });

  it("renders no panel and no aria-controls without one", () => {
    const { container } = render(Tabs, { props: { tabs, activeIndex: 0 } });

    expect(container.querySelector('[role="tabpanel"]')).toBeNull();
    for (const tab of tabEls(container)) {
      expect(tab).not.toHaveAttribute("aria-controls");
    }
  });

  it("moves aria-selected, tabindex and labelledby together on rerender", async () => {
    const { container, rerender } = render(Tabs, {
      props: { tabs, activeIndex: 0, panel },
    });

    await rerender({ tabs, activeIndex: 2, panel });
    const els = tabEls(container);
    expect(els[0]).toHaveAttribute("aria-selected", "false");
    expect(els[0]).toHaveAttribute("tabindex", "-1");
    expect(els[2]).toHaveAttribute("aria-selected", "true");
    expect(els[2]).toHaveAttribute("tabindex", "0");
    expect(container.querySelectorAll('[aria-selected="true"]')).toHaveLength(
      1,
    );

    const el = container.querySelector('[role="tabpanel"]') as HTMLElement;
    expect(el).toHaveAttribute("aria-labelledby", els[2].id);
  });

  it("passes activeIndex to the panel snippet", () => {
    // A raw snippet with only render() is static, so prove the argument
    // with fresh renders rather than a rerender.
    const at = (activeIndex: number) =>
      render(Tabs, {
        props: { tabs, activeIndex, panel },
      }).container.querySelector('[role="tabpanel"]');

    expect(at(0)).toHaveTextContent("panel 0");
    expect(at(2)).toHaveTextContent("panel 2");
  });

  it("passes rest attributes and extra classes through to the tablist", () => {
    const { container } = render(Tabs, {
      props: {
        tabs,
        activeIndex: 0,
        "aria-label": "Sections",
        id: "sections",
        class: "extra",
      },
    });

    const list = container.firstElementChild as HTMLElement;
    expect(list).toHaveAttribute("aria-label", "Sections");
    expect(list).toHaveAttribute("id", "sections");
    expect(list).toHaveClass("dex-tabs", "extra");
    expect(list).toHaveAttribute("role", "tablist");
  });
});
