import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import ButtonGroup from "./ButtonGroup.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>child content</span>",
}));

describe("ButtonGroup", () => {
  it("renders a single div with the dex-btn-group class and its children", () => {
    const { container } = render(ButtonGroup, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-btn-group");
    expect(el).toHaveTextContent("child content");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(ButtonGroup, {
      props: { children, id: "group", "aria-label": "Group", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "group");
    expect(el).toHaveAttribute("aria-label", "Group");
    expect(el).toHaveClass("dex-btn-group", "extra");
  });
});
