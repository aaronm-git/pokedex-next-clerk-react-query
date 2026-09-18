import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Cluster from "./Cluster.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>child content</span>",
}));

describe("Cluster", () => {
  it("renders a single div with the base class around its children", () => {
    const { container } = render(Cluster, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-cluster");
    expect(el).toHaveTextContent("child content");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Cluster, {
      props: { children, id: "tags", "aria-label": "Types", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "tags");
    expect(el).toHaveAttribute("aria-label", "Types");
    expect(el).toHaveClass("dex-cluster", "extra");
  });
});
