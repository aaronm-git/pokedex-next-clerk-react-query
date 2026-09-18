import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Card from "./Card.svelte";

const props = { label: "Seen", value: "151" };

describe("Card", () => {
  it("renders a div with label and value and no caption by default", () => {
    const { container } = render(Card, { props });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-card");
    expect(el).not.toHaveClass("dex-card--inverted");
    expect(el).not.toHaveClass("dex-card--link");
    expect(el).not.toHaveAttribute("href");
    expect(el.querySelector(".dex-card__label")).toHaveTextContent("Seen");
    expect(el.querySelector(".dex-card__value")).toHaveTextContent("151");
    expect(el.querySelector(".dex-card__caption")).toBeNull();
  });

  it("renders the caption span when given", () => {
    const { container } = render(Card, {
      props: { ...props, caption: "of 151 in Kanto" },
    });

    expect(container.querySelector(".dex-card__caption")).toHaveTextContent(
      "of 151 in Kanto",
    );
  });

  it("adds the inverted modifier when asked", () => {
    const { container } = render(Card, { props: { ...props, inverted: true } });

    expect(container.firstElementChild).toHaveClass(
      "dex-card",
      "dex-card--inverted",
    );
  });

  it("renders an anchor with the link modifier when href is given", () => {
    const { container } = render(Card, {
      props: { ...props, href: "/pokedex" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("A");
    expect(el).toHaveClass("dex-card", "dex-card--link");
    expect(el).toHaveAttribute("href", "/pokedex");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Card, {
      props: {
        ...props,
        id: "seen",
        "aria-label": "Seen count",
        class: "extra",
      },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "seen");
    expect(el).toHaveAttribute("aria-label", "Seen count");
    expect(el).toHaveClass("dex-card", "extra");
  });
});
