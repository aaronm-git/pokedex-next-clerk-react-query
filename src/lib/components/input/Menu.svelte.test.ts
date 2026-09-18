import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Menu, { type MenuItem } from "./Menu.svelte";

const links: MenuItem[] = [
  { id: "data", label: "Data", href: "/data" },
  { id: "search", label: "Search", href: "/search" },
  { id: "fav", label: "Favorites", href: "/favorites", hint: "12" },
  { id: "quit", label: "Quit", href: "/quit" },
];

const buttons: MenuItem[] = [
  { id: "data", label: "Data" },
  { id: "cry", label: "Cry" },
  { id: "area", label: "Area", disabled: true },
  { id: "quit", label: "Quit" },
];

const items = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(".dex-menu__item"));

describe("Menu", () => {
  it("renders a nav of menu items, links when they have an href", () => {
    const { container } = render(Menu, {
      props: { items: links, activeIndex: 0 },
    });

    expect(container.children).toHaveLength(1);
    const nav = container.firstElementChild as HTMLElement;
    expect(nav.tagName).toBe("NAV");
    expect(nav).toHaveClass("dex-menu");
    expect(nav).not.toHaveClass("dex-menu--row");

    const els = items(nav);
    expect(els).toHaveLength(4);
    for (const el of els) expect(el.tagName).toBe("A");
    expect(els[1]).toHaveAttribute("href", "/search");
    expect(els[1]).toHaveTextContent("Search");
  });

  it("renders buttons of type button when there is no href", () => {
    const { container } = render(Menu, {
      props: { items: buttons, activeIndex: 0 },
    });

    const els = items(container);
    for (const el of els) {
      expect(el.tagName).toBe("BUTTON");
      expect(el).toHaveAttribute("type", "button");
      expect(el).not.toHaveAttribute("href");
    }
  });

  it("marks only the active item with aria-current=true and follows the prop", async () => {
    const { container, rerender } = render(Menu, {
      props: { items: links, activeIndex: 0 },
    });

    let els = items(container);
    expect(els[0]).toHaveAttribute("aria-current", "true");
    expect(els[1]).not.toHaveAttribute("aria-current");
    expect(els[2]).not.toHaveAttribute("aria-current");
    expect(els[3]).not.toHaveAttribute("aria-current");

    await rerender({ items: links, activeIndex: 2 });
    els = items(container);
    expect(els[0]).not.toHaveAttribute("aria-current");
    expect(els[2]).toHaveAttribute("aria-current", "true");
    expect(container.querySelectorAll('[aria-current="true"]')).toHaveLength(1);
  });

  it("calls onactivate once with the clicked index", async () => {
    const user = userEvent.setup();
    const onactivate = vi.fn();
    const { container } = render(Menu, {
      props: { items: buttons, activeIndex: 0, onactivate },
    });

    await user.click(items(container)[1]);
    expect(onactivate).toHaveBeenCalledTimes(1);
    expect(onactivate).toHaveBeenCalledWith(1);
  });

  it("renders the hint inside the item after the label", () => {
    const { container } = render(Menu, {
      props: { items: links, activeIndex: 0 },
    });

    const fav = items(container)[2];
    const hint = fav.querySelector(".dex-menu__hint");
    expect(hint).not.toBeNull();
    expect(hint).toHaveTextContent("12");
    expect(fav.textContent?.trim().startsWith("Favorites")).toBe(true);
    expect(items(container)[0].querySelector(".dex-menu__hint")).toBeNull();
  });

  it("disables a button item with the disabled attribute and never activates it", async () => {
    const user = userEvent.setup();
    const onactivate = vi.fn();
    const { container } = render(Menu, {
      props: { items: buttons, activeIndex: 0, onactivate },
    });

    const area = items(container)[2];
    expect(area).toHaveAttribute("aria-disabled", "true");
    expect(area).toBeDisabled();
    expect(items(container)[1]).not.toHaveAttribute("aria-disabled");

    await user.click(area);
    expect(onactivate).not.toHaveBeenCalled();
  });

  it("turns a disabled link into a placeholder link without href", async () => {
    const user = userEvent.setup();
    const onactivate = vi.fn();
    const { container } = render(Menu, {
      props: {
        items: [
          { id: "a", label: "A", href: "/a" },
          { id: "b", label: "B", href: "/b", disabled: true },
          { id: "c", label: "C", href: "/c" },
        ],
        activeIndex: 0,
        onactivate,
      },
    });

    const b = items(container)[1];
    expect(b.tagName).toBe("A");
    expect(b).toHaveAttribute("aria-disabled", "true");
    expect(b).not.toHaveAttribute("href");

    await user.click(b);
    expect(onactivate).not.toHaveBeenCalled();
  });

  it("skips disabled items when tabbing", async () => {
    const user = userEvent.setup();
    const { container } = render(Menu, {
      props: { items: buttons, activeIndex: 0 },
    });

    const els = items(container);
    await user.tab();
    expect(document.activeElement).toBe(els[0]);
    await user.tab();
    expect(document.activeElement).toBe(els[1]);
    await user.tab();
    expect(document.activeElement).toBe(els[3]);
  });

  it("activates the focused item with Enter", async () => {
    const user = userEvent.setup();
    const onactivate = vi.fn();
    const { container } = render(Menu, {
      props: { items: buttons, activeIndex: 0, onactivate },
    });

    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(items(container)[1]);
    await user.keyboard("{Enter}");
    expect(onactivate).toHaveBeenCalledTimes(1);
    expect(onactivate).toHaveBeenCalledWith(1);
  });

  it("moves focus to the item that becomes current, but not on mount", async () => {
    const { container, rerender } = render(Menu, {
      props: { items: links, activeIndex: 0 },
    });

    expect(document.activeElement).toBe(document.body);

    await rerender({ items: links, activeIndex: 2 });
    expect(document.activeElement).toBe(items(container)[2]);

    await rerender({ items: links, activeIndex: 1 });
    expect(document.activeElement).toBe(items(container)[1]);
  });

  it("leaves focus in a text field while the cursor moves under it", async () => {
    const field = document.createElement("input");
    document.body.append(field);
    const { rerender } = render(Menu, {
      props: { items: links, activeIndex: 0 },
    });
    field.focus();

    await rerender({ items: links, activeIndex: 2 });
    expect(document.activeElement).toBe(field);
    field.remove();
  });

  it("reports the item that gains focus through oncursor", async () => {
    const user = userEvent.setup();
    const oncursor = vi.fn();
    const { container } = render(Menu, {
      props: { items: buttons, activeIndex: 0, oncursor },
    });

    await user.tab();
    await user.tab();
    expect(oncursor).toHaveBeenLastCalledWith(1);

    await user.click(items(container)[3]);
    expect(oncursor).toHaveBeenLastCalledWith(3);
  });

  it("adds the row modifier when asked", () => {
    const { container } = render(Menu, {
      props: { items: links, activeIndex: 0, row: true },
    });

    expect(container.firstElementChild).toHaveClass(
      "dex-menu",
      "dex-menu--row",
    );
  });

  it("passes rest attributes and extra classes through to the nav", () => {
    const { container } = render(Menu, {
      props: {
        items: links,
        activeIndex: 0,
        "aria-label": "Main",
        id: "main-menu",
        class: "extra",
      },
    });

    const nav = container.firstElementChild as HTMLElement;
    expect(nav).toHaveAttribute("aria-label", "Main");
    expect(nav).toHaveAttribute("id", "main-menu");
    expect(nav).toHaveClass("dex-menu", "extra");
  });
});
