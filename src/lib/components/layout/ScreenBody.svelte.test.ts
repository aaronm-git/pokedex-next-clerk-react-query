import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import ScreenBody from "./ScreenBody.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>child content</span>",
}));

describe("ScreenBody", () => {
  it("renders a single div with the base class and its children", () => {
    const { container } = render(ScreenBody, { props: { children } });

    expect(container.children).toHaveLength(1);
    const body = container.firstElementChild as HTMLElement;
    expect(body.tagName).toBe("DIV");
    expect(body).toHaveClass("dex-screen-body");
    expect(body).toHaveTextContent("child content");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(ScreenBody, {
      props: { children, id: "screen", "aria-label": "Screen", class: "extra" },
    });

    const body = container.firstElementChild as HTMLElement;
    expect(body).toHaveAttribute("id", "screen");
    expect(body).toHaveAttribute("aria-label", "Screen");
    expect(body).toHaveClass("dex-screen-body", "extra");
  });
});
