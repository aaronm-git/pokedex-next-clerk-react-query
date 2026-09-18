import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Split from "./Split.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>child content</span>",
}));

describe("Split", () => {
  it("renders a single div with the base class around its children", () => {
    const { container } = render(Split, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-split");
    expect(el).toHaveTextContent("child content");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Split, {
      props: { children, id: "detail", "aria-label": "Detail", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "detail");
    expect(el).toHaveAttribute("aria-label", "Detail");
    expect(el).toHaveClass("dex-split", "extra");
  });
});
