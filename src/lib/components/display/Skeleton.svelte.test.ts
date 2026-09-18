import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Skeleton from "./Skeleton.svelte";

describe("Skeleton", () => {
  it("renders one bare hidden bar by default", () => {
    const { container } = render(Skeleton);

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-skeleton");
    expect(el).not.toHaveClass("dex-stack");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el.children).toHaveLength(0);
  });

  it("stacks several bars inside a tight stack", () => {
    const { container } = render(Skeleton, { props: { count: 3 } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass("dex-stack", "dex-stack--tight");
    expect(el).not.toHaveClass("dex-skeleton");

    const bars = el.querySelectorAll(":scope > .dex-skeleton");
    expect(bars).toHaveLength(3);
    for (const bar of bars) {
      expect(bar.tagName).toBe("DIV");
      expect(bar).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("passes rest attributes and extra classes to the single bar", () => {
    const { container } = render(Skeleton, {
      props: { id: "row-bar", "aria-label": "Loading row", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "row-bar");
    expect(el).toHaveAttribute("aria-label", "Loading row");
    expect(el).toHaveClass("dex-skeleton", "extra");
  });

  it("passes rest attributes and extra classes to the stack when count > 1", () => {
    const { container } = render(Skeleton, {
      props: { count: 2, id: "list-bars", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "list-bars");
    expect(el).toHaveClass("dex-stack", "dex-stack--tight", "extra");
    expect(el.querySelectorAll(".dex-skeleton")).toHaveLength(2);
  });
});
