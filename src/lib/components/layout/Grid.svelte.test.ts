import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Grid from "./Grid.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>child content</span>",
}));

describe("Grid", () => {
  it("renders a single div with the base class and its children", () => {
    const { container } = render(Grid, { props: { children } });

    expect(container.children).toHaveLength(1);
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.tagName).toBe("DIV");
    expect(grid).toHaveClass("dex-grid");
    expect(grid).not.toHaveClass("dex-grid--2");
    expect(grid).not.toHaveClass("dex-grid--3");
    expect(grid).toHaveTextContent("child content");
  });

  it("adds the column modifier for cols 2 and 3", () => {
    const two = render(Grid, { props: { children, cols: 2 } });
    expect(two.container.firstElementChild).toHaveClass(
      "dex-grid",
      "dex-grid--2",
    );
    expect(two.container.firstElementChild).not.toHaveClass("dex-grid--3");
    two.unmount();

    const three = render(Grid, { props: { children, cols: 3 } });
    expect(three.container.firstElementChild).toHaveClass(
      "dex-grid",
      "dex-grid--3",
    );
    expect(three.container.firstElementChild).not.toHaveClass("dex-grid--2");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Grid, {
      props: { children, id: "tiles", "aria-label": "Tiles", class: "extra" },
    });

    const grid = container.firstElementChild as HTMLElement;
    expect(grid).toHaveAttribute("id", "tiles");
    expect(grid).toHaveAttribute("aria-label", "Tiles");
    expect(grid).toHaveClass("dex-grid", "extra");
  });
});
