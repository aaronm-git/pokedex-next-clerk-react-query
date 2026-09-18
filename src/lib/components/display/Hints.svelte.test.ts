import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Hints from "./Hints.svelte";

const hints = [
  { key: "A", label: "Select" },
  { key: "B", label: "Back" },
  { key: "←→", label: "Prev / next" },
];

describe("Hints", () => {
  it("renders a footer with one kbd-labelled span per hint", () => {
    const { container } = render(Hints, { props: { hints } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("FOOTER");
    expect(el).toHaveClass("dex-hints");

    const items = el.querySelectorAll(":scope > span");
    expect(items).toHaveLength(3);
    const first = items[0] as HTMLElement;
    expect(first.querySelector("kbd")).toHaveTextContent("A");
    expect(first).toHaveTextContent("ASelect");
    expect(items[2].querySelector("kbd")).toHaveTextContent("←→");
  });

  it("renders an empty footer for no hints", () => {
    const { container } = render(Hints, { props: { hints: [] } });

    expect(container.firstElementChild?.querySelectorAll("span")).toHaveLength(
      0,
    );
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Hints, {
      props: { hints, id: "legend", "aria-label": "Controls", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "legend");
    expect(el).toHaveAttribute("aria-label", "Controls");
    expect(el).toHaveClass("dex-hints", "extra");
  });
});
