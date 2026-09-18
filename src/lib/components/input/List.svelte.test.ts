import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import List, { type RowData } from "./List.svelte";

const rows: RowData[] = [
  { id: 1, number: 1, name: "Bulbasaur", owned: true },
  { id: 4, number: 4, name: "Charmander", owned: true },
  { id: 7, number: 7, name: "Squirtle" },
  { id: 10, number: 10, name: "Caterpie", unseen: true },
];

const rowsOf = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(".dex-row")) as HTMLElement[];

describe("List", () => {
  it("renders a dex-list div with one row per item, in order", () => {
    const { container } = render(List, { props: { rows, activeIndex: 0 } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-list");
    expect(el).not.toHaveAttribute("role");

    const items = rowsOf(el);
    expect(items).toHaveLength(4);
    expect(
      items.map((r) => r.querySelector(".dex-row__no")?.textContent),
    ).toEqual(["001", "004", "007", "010"]);
    expect(items[0].querySelector(".dex-row__name")).toHaveTextContent(
      "Bulbasaur",
    );
    expect(items[0].querySelector(".dex-ball")).toHaveClass("dex-ball--filled");
    expect(items[2].querySelector(".dex-ball")).not.toHaveClass(
      "dex-ball--filled",
    );
    expect(items[3]).toHaveClass("dex-row--unseen");
  });

  it("marks only the row at activeIndex as current", () => {
    const { container } = render(List, { props: { rows, activeIndex: 1 } });

    const items = rowsOf(container);
    expect(items[1]).toHaveAttribute("aria-current", "true");
    expect(items.filter((r) => r.hasAttribute("aria-current"))).toHaveLength(1);
  });

  it("marks nothing current when activeIndex is out of range", () => {
    const over = render(List, { props: { rows, activeIndex: 99 } });
    expect(over.container.querySelector("[aria-current]")).toBeNull();

    const under = render(List, { props: { rows, activeIndex: -1 } });
    expect(under.container.querySelector("[aria-current]")).toBeNull();
  });

  it("follows activeIndex when the prop changes", async () => {
    const { container, rerender } = render(List, {
      props: { rows, activeIndex: 0 },
    });

    expect(rowsOf(container)[0]).toHaveAttribute("aria-current", "true");

    await rerender({ activeIndex: 2 });

    const items = rowsOf(container);
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[2]).toHaveAttribute("aria-current", "true");
  });

  it("moves focus to the row that becomes current, but not on mount", async () => {
    const { container, rerender } = render(List, {
      props: { rows, activeIndex: 0 },
    });

    expect(document.activeElement).toBe(document.body);

    await rerender({ activeIndex: 2 });
    expect(document.activeElement).toBe(rowsOf(container)[2]);
  });

  it("reports the row that gains focus through oncursor", async () => {
    const user = userEvent.setup();
    const oncursor = vi.fn();
    const { container } = render(List, {
      props: { rows, activeIndex: 0, oncursor },
    });

    await user.click(rowsOf(container)[1]);
    expect(oncursor).toHaveBeenLastCalledWith(1);

    await user.tab();
    expect(document.activeElement).toBe(rowsOf(container)[2]);
    expect(oncursor).toHaveBeenLastCalledWith(2);
  });

  it("calls onactivate with the index of the clicked row, once", async () => {
    const onactivate = vi.fn();
    const { container } = render(List, {
      props: { rows, activeIndex: 0, onactivate },
    });

    await userEvent.click(rowsOf(container)[2]);

    expect(onactivate).toHaveBeenCalledTimes(1);
    expect(onactivate).toHaveBeenCalledWith(2);
  });

  it("renders rows with href as links", () => {
    const linked = rows.map((r) => ({ ...r, href: `/pokemon/${r.number}` }));
    const { container } = render(List, {
      props: { rows: linked, activeIndex: 0 },
    });

    const items = rowsOf(container);
    expect(items.every((r) => r.tagName === "A")).toBe(true);
    expect(items[1]).toHaveAttribute("href", "/pokemon/4");
  });

  it("passes the row and its index to the end snippet", () => {
    const end = createRawSnippet<[RowData, number]>((row, i) => ({
      render: () => `<b>${row().name}#${i()}</b>`,
    }));
    const { container } = render(List, {
      props: { rows, activeIndex: 0, end },
    });

    const ends = Array.from(container.querySelectorAll(".dex-row__end"));
    expect(ends).toHaveLength(4);
    expect(ends[1]).toHaveTextContent("Charmander#1");
    expect(ends[3]).toHaveTextContent("Caterpie#3");
  });

  it("passes rest attributes and extra classes to the list div", () => {
    const { container } = render(List, {
      props: {
        rows,
        activeIndex: 0,
        id: "dex",
        "aria-label": "Pokédex",
        class: "extra",
      },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "dex");
    expect(el).toHaveAttribute("aria-label", "Pokédex");
    expect(el).toHaveClass("dex-list", "extra");
  });
});
