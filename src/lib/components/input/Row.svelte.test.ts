import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Row from "./Row.svelte";

const props = { number: 1, name: "Bulbasaur" };

const first = (container: HTMLElement) =>
  container.firstElementChild as HTMLElement;

describe("Row", () => {
  it("renders a button row with number, outline ball, name and empty end", () => {
    const { container } = render(Row, { props });

    expect(container.children).toHaveLength(1);
    const el = first(container);
    expect(el.tagName).toBe("BUTTON");
    expect(el).toHaveAttribute("type", "button");
    expect(el).not.toHaveAttribute("href");
    expect(el).toHaveClass("dex-row");
    expect(el).not.toHaveClass("dex-row--unseen");
    expect(el).not.toHaveClass("dex-row--thumb");
    expect(el).not.toHaveAttribute("aria-current");
    expect(el).not.toHaveAttribute("aria-label");

    // Four grid children, in order: number, ball, name, end.
    expect(el.children).toHaveLength(4);
    expect(el.children[0]).toHaveClass("dex-row__no");
    expect(el.children[1]).toHaveClass("dex-ball");
    expect(el.children[2]).toHaveClass("dex-row__name");
    expect(el.children[3]).toHaveClass("dex-row__end");

    expect(el.querySelector(".dex-row__no")).toHaveTextContent("001");
    expect(el.querySelector(".dex-row__name")).toHaveTextContent("Bulbasaur");
    expect(el.querySelector(".dex-ball")).not.toHaveClass("dex-ball--filled");
    expect(el.querySelector(".dex-row__end")).toBeEmptyDOMElement();
    expect(el.querySelector(".dex-row__thumb")).toBeNull();
  });

  it("renders an anchor without a type attribute when href is given", () => {
    const { container } = render(Row, {
      props: { ...props, href: "/pokemon/1" },
    });

    const el = first(container);
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "/pokemon/1");
    expect(el).not.toHaveAttribute("type");
    expect(el).toHaveClass("dex-row");
  });

  it("zero-pads the number to three digits", () => {
    const no = (number: number) =>
      render(Row, { props: { number, name: "x" } }).container.querySelector(
        ".dex-row__no",
      )?.textContent;

    expect(no(7)).toBe("007");
    expect(no(25)).toBe("025");
    expect(no(151)).toBe("151");
  });

  it("fills the ball when owned", () => {
    const { container } = render(Row, { props: { ...props, owned: true } });

    expect(container.querySelector(".dex-ball")).toHaveClass(
      "dex-ball--filled",
    );
  });

  it("marks an unseen row: modifier, no ball, empty name, labelled by number", () => {
    const { container } = render(Row, {
      props: { number: 10, name: "Caterpie", unseen: true },
    });

    const el = first(container);
    expect(el).toHaveClass("dex-row", "dex-row--unseen");
    expect(el.children).toHaveLength(4);
    expect(el.querySelector(".dex-ball")).toBeNull();
    expect(el.querySelector(".dex-row__thumb")).toBeNull();
    expect(el.querySelector(".dex-row__name")).toBeEmptyDOMElement();
    expect(el).toHaveAccessibleName("010 unseen");
    expect(el).not.toHaveTextContent("Caterpie");
  });

  it("renders a decorative thumb instead of the ball", () => {
    const { container } = render(Row, {
      props: { number: 25, name: "Pikachu", owned: true, thumb: "/25.png" },
    });

    const el = first(container);
    expect(el).toHaveClass("dex-row", "dex-row--thumb");
    expect(el.querySelector(".dex-ball")).toBeNull();
    const img = el.children[1] as HTMLImageElement;
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveClass("dex-row__thumb");
    expect(img).toHaveAttribute("src", "/25.png");
    expect(img).toHaveAttribute("alt", "");
  });

  it("sets aria-current to the string true only when current", () => {
    const on = render(Row, { props: { ...props, current: true } });
    expect(first(on.container)).toHaveAttribute("aria-current", "true");

    const off = render(Row, { props: { ...props, current: false } });
    expect(first(off.container)).not.toHaveAttribute("aria-current");
  });

  it("renders the end snippet inside the end span", () => {
    const end = createRawSnippet(() => ({
      render: () => '<span class="dex-type" data-type="grass">Grass</span>',
    }));
    const { container } = render(Row, { props: { ...props, end } });

    const slot = container.querySelector(".dex-row__end") as HTMLElement;
    expect(slot.querySelector(".dex-type")).toHaveTextContent("Grass");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Row, {
      props: { ...props, id: "row-1", "data-testid": "row", class: "extra" },
    });

    const el = first(container);
    expect(el).toHaveAttribute("id", "row-1");
    expect(el).toHaveAttribute("data-testid", "row");
    expect(el).toHaveClass("dex-row", "extra");
  });

  it("is reachable by Tab and fires onclick on Enter", async () => {
    const onclick = vi.fn();
    const { container } = render(Row, { props: { ...props, onclick } });

    const el = first(container);
    await userEvent.tab();
    expect(document.activeElement).toBe(el);

    await userEvent.keyboard("{Enter}");
    expect(onclick).toHaveBeenCalledTimes(1);
  });
});
