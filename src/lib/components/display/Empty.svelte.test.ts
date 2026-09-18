import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Empty from "./Empty.svelte";

// A raw snippet renders one root element, so the paragraph stands in for
// whatever the caller drops in after the title.
const children = createRawSnippet(() => ({
  render: () => "<p>Open a Pokémon and press A to save it here.</p>",
}));

describe("Empty", () => {
  it("renders a div with the title in a span and nothing else", () => {
    const { container } = render(Empty, {
      props: { title: "No favorites yet" },
    });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-empty");
    expect(el.children).toHaveLength(1);
    expect(el.firstElementChild?.tagName).toBe("SPAN");
    expect(el.firstElementChild).toHaveTextContent("No favorites yet");
  });

  it("renders children after the title", () => {
    const { container } = render(Empty, {
      props: { title: "No favorites yet", children },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el.children).toHaveLength(2);
    expect(el.children[0].tagName).toBe("SPAN");
    expect(el.children[0]).toHaveTextContent("No favorites yet");
    expect(el.children[1].tagName).toBe("P");
    expect(el.children[1]).toHaveTextContent("press A");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Empty, {
      props: {
        title: "Nothing here",
        id: "empty",
        "aria-label": "Empty list",
        class: "extra",
      },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "empty");
    expect(el).toHaveAttribute("aria-label", "Empty list");
    expect(el).toHaveClass("dex-empty", "extra");
  });
});
