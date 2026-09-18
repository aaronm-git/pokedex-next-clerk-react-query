import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Types from "./Types.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>child content</span>",
}));

describe("Types", () => {
  it("renders a single div with the dex-types class and its children", () => {
    const { container } = render(Types, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-types");
    expect(el).toHaveTextContent("child content");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Types, {
      props: { children, id: "group", "aria-label": "Group", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "group");
    expect(el).toHaveAttribute("aria-label", "Group");
    expect(el).toHaveClass("dex-types", "extra");
  });
});
