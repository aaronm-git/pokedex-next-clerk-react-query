import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Loading from "./Loading.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Fetching 151 entries.</span>",
}));

describe("Loading", () => {
  it("renders a status div with the default label in the dots span", () => {
    const { container } = render(Loading);

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-loading");
    expect(el).toHaveAttribute("role", "status");
    expect(el.children).toHaveLength(1);
    const dots = el.firstElementChild as HTMLElement;
    expect(dots.tagName).toBe("SPAN");
    expect(dots).toHaveClass("dex-loading__dots");
    expect(dots).toHaveTextContent("Loading");
    expect(el.querySelector("p")).toBeNull();
  });

  it("renders a custom label and children inside a paragraph", () => {
    const { container } = render(Loading, {
      props: { label: "Searching", children },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el.querySelector(".dex-loading__dots")).toHaveTextContent(
      "Searching",
    );
    const p = el.querySelector(":scope > p");
    expect(p).not.toBeNull();
    expect(p).toHaveTextContent("Fetching 151 entries.");
  });

  it("lets rest override the role and passes attributes through", () => {
    const { container } = render(Loading, {
      props: {
        id: "busy",
        role: "alert",
        "aria-label": "Please wait",
        class: "extra",
      },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "busy");
    expect(el).toHaveAttribute("role", "alert");
    expect(el).toHaveAttribute("aria-label", "Please wait");
    expect(el).toHaveClass("dex-loading", "extra");
  });
});
