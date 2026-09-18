import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Ball from "./Ball.svelte";

describe("Ball", () => {
  it("renders an empty decorative i with the base class", () => {
    const { container } = render(Ball);

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("I");
    expect(el).toHaveClass("dex-ball");
    expect(el).not.toHaveClass("dex-ball--filled");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toBeEmptyDOMElement();
  });

  it("adds the filled modifier when asked", () => {
    const { container } = render(Ball, { props: { filled: true } });

    expect(container.firstElementChild).toHaveClass(
      "dex-ball",
      "dex-ball--filled",
    );
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Ball, {
      props: { id: "owned", "aria-label": "Owned", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "owned");
    expect(el).toHaveAttribute("aria-label", "Owned");
    expect(el).toHaveClass("dex-ball", "extra");
  });
});
