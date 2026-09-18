import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Stack from "./Stack.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>child content</span>",
}));

describe("Stack", () => {
  it("renders a single div with the base class around its children", () => {
    const { container } = render(Stack, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-stack");
    expect(el).not.toHaveClass("dex-stack--tight");
    expect(el).toHaveTextContent("child content");
  });

  it("adds the tight modifier when asked", () => {
    const { container } = render(Stack, { props: { children, tight: true } });

    expect(container.firstElementChild).toHaveClass(
      "dex-stack",
      "dex-stack--tight",
    );
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Stack, {
      props: { children, id: "list", "aria-label": "Results", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "list");
    expect(el).toHaveAttribute("aria-label", "Results");
    expect(el).toHaveClass("dex-stack", "extra");
  });
});
