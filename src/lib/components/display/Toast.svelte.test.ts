import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Toast from "./Toast.svelte";

const children = createRawSnippet(() => ({
  render: () => "Added Pikachu to favorites",
}));

describe("Toast", () => {
  it("renders a single status div with the base class around its children", () => {
    const { container } = render(Toast, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-toast");
    expect(el).toHaveAttribute("role", "status");
    expect(el).toHaveTextContent("Added Pikachu to favorites");
  });

  it("lets a caller override the role", () => {
    const { container } = render(Toast, {
      props: { children, role: "alert" },
    });

    expect(container.firstElementChild).toHaveAttribute("role", "alert");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Toast, {
      props: { children, id: "toast", "aria-label": "Saved", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "toast");
    expect(el).toHaveAttribute("aria-label", "Saved");
    expect(el).toHaveClass("dex-toast", "extra");
  });
});
