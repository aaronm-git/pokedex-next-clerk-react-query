import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Bars from "./Bars.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>child content</span>",
}));

describe("Bars", () => {
  it("renders a single div with the dex-bars class and its children", () => {
    const { container } = render(Bars, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-bars");
    expect(el).toHaveTextContent("child content");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Bars, {
      props: { children, id: "group", "aria-label": "Group", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "group");
    expect(el).toHaveAttribute("aria-label", "Group");
    expect(el).toHaveClass("dex-bars", "extra");
  });
});
