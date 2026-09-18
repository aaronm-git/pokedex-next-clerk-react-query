import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Sprite from "./Sprite.svelte";

const props = { src: "/sprites/1.png", alt: "Bulbasaur" };

describe("Sprite", () => {
  it("renders a div well with an img inside", () => {
    const { container } = render(Sprite, { props });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-sprite");
    expect(el).not.toHaveClass("dex-sprite--lg");
    expect(el).not.toHaveClass("dex-sprite--inverted");

    const img = el.querySelector("img") as HTMLImageElement;
    expect(img).toHaveAttribute("src", "/sprites/1.png");
    expect(img).toHaveAttribute("alt", "Bulbasaur");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
    expect(img).not.toHaveAttribute("width");
    expect(img).not.toHaveAttribute("height");
  });

  it("adds the lg and inverted modifiers when asked", () => {
    const { container } = render(Sprite, {
      props: { ...props, lg: true, inverted: true },
    });

    expect(container.firstElementChild).toHaveClass(
      "dex-sprite",
      "dex-sprite--lg",
      "dex-sprite--inverted",
    );
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Sprite, {
      props: { ...props, id: "hero", "aria-label": "Sprite", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "hero");
    expect(el).toHaveAttribute("aria-label", "Sprite");
    expect(el).toHaveClass("dex-sprite", "extra");
  });
});
