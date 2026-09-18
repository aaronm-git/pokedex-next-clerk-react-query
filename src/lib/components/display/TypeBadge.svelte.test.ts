import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import TypeBadge from "./TypeBadge.svelte";

describe("TypeBadge", () => {
  it("renders a span with the base class, the name, and data-type", () => {
    const { container } = render(TypeBadge, { props: { type: "fire" } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("dex-type");
    expect(el).toHaveTextContent("fire");
    expect(el).toHaveAttribute("data-type", "fire");
  });

  it("lowercases the type for data-type but shows the name as given", () => {
    const { container } = render(TypeBadge, { props: { type: "Water" } });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("data-type", "water");
    expect(el).toHaveTextContent("Water");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(TypeBadge, {
      props: {
        type: "grass",
        id: "t1",
        "aria-label": "Grass type",
        class: "extra",
      },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "t1");
    expect(el).toHaveAttribute("aria-label", "Grass type");
    expect(el).toHaveClass("dex-type", "extra");
  });
});
