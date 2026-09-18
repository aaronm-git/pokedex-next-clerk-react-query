import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Box from "./Box.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>child content</span>",
}));

describe("Box", () => {
  it("renders a single div with the base class around its children", () => {
    const { container } = render(Box, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-box");
    expect(el).not.toHaveClass("dex-box--thick");
    expect(el).not.toHaveClass("dex-box--single");
    expect(el).not.toHaveClass("dex-box--inverted");
    expect(el).not.toHaveClass("dex-box--flush");
    expect(el.querySelector(".dex-box__title")).toBeNull();
    expect(el).toHaveTextContent("child content");
  });

  it("renders the title span before the children when given", () => {
    const { container } = render(Box, {
      props: { children, title: "Stats" },
    });

    const el = container.firstElementChild as HTMLElement;
    const title = el.firstElementChild as HTMLElement;
    expect(title.tagName).toBe("SPAN");
    expect(title).toHaveClass("dex-box__title");
    expect(title).toHaveTextContent("Stats");
    expect(el).toHaveTextContent("child content");
  });

  it("adds each modifier when asked", () => {
    const { container } = render(Box, {
      props: {
        children,
        thick: true,
        single: true,
        inverted: true,
        flush: true,
      },
    });

    expect(container.firstElementChild).toHaveClass(
      "dex-box",
      "dex-box--thick",
      "dex-box--single",
      "dex-box--inverted",
      "dex-box--flush",
    );
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Box, {
      props: { children, id: "frame", "aria-label": "Stats", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "frame");
    expect(el).toHaveAttribute("aria-label", "Stats");
    expect(el).toHaveClass("dex-box", "extra");
  });
});
