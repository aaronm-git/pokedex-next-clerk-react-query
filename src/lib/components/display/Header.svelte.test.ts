import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Header from "./Header.svelte";

describe("Header", () => {
  it("renders a header with an h1 title and no meta by default", () => {
    const { container } = render(Header, { props: { title: "Pokédex" } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("HEADER");
    expect(el).toHaveClass("dex-header");
    const heading = el.querySelector("h1") as HTMLElement;
    expect(heading).toHaveClass("dex-header__title");
    expect(heading).toHaveTextContent("Pokédex");
    expect(el.querySelector(".dex-header__meta")).toBeNull();
  });

  it("renders an h2 when level is 2", () => {
    const { container } = render(Header, {
      props: { title: "Favorites", level: 2 },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el.querySelector("h1")).toBeNull();
    expect(el.querySelector("h2")).toHaveClass("dex-header__title");
  });

  it("renders one meta span per entry with the value in a b", () => {
    const { container } = render(Header, {
      props: {
        title: "Pokédex",
        meta: [
          { label: "Seen", value: "151" },
          { label: "Own", value: "097" },
        ],
      },
    });

    const meta = container.querySelector(".dex-header__meta") as HTMLElement;
    expect(meta.tagName).toBe("DIV");
    const spans = meta.querySelectorAll(":scope > span");
    expect(spans).toHaveLength(2);
    expect(spans[0]).toHaveTextContent("Seen 151");
    expect(spans[0].querySelector("b")).toHaveTextContent("151");
    expect(spans[1]).toHaveTextContent("Own 097");
  });

  it("omits the meta div when the list is empty", () => {
    const { container } = render(Header, {
      props: { title: "Pokédex", meta: [] },
    });

    expect(container.querySelector(".dex-header__meta")).toBeNull();
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Header, {
      props: {
        title: "Pokédex",
        id: "screen-title",
        "aria-label": "Screen",
        class: "extra",
      },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "screen-title");
    expect(el).toHaveAttribute("aria-label", "Screen");
    expect(el).toHaveClass("dex-header", "extra");
  });
});
