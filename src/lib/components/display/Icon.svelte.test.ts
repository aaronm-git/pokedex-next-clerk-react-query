import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "$lib/icons/paths";
import Icon from "./Icon.svelte";

describe("Icon", () => {
  it("renders one svg on the 24 grid with the named path, inheriting currentColor", () => {
    const { container } = render(Icon, { props: { name: "search" } });

    expect(container.children).toHaveLength(1);
    const svg = container.firstElementChild as SVGSVGElement;
    expect(svg.tagName.toLowerCase()).toBe("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg.querySelectorAll("path")).toHaveLength(1);
    expect(svg.querySelector("path")).toHaveAttribute("d", ICON_PATHS.search);
    expect(svg.querySelector("path")).not.toHaveAttribute("fill");
  });

  it("is decorative by default and labelled when asked", () => {
    const plain = render(Icon, { props: { name: "heart" } });
    const svg = plain.container.firstElementChild as SVGSVGElement;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
    expect(svg).not.toHaveAttribute("aria-label");
    plain.unmount();

    const named = render(Icon, { props: { name: "heart", label: "Favorite" } });
    expect(named.getByRole("img", { name: "Favorite" })).not.toHaveAttribute(
      "aria-hidden",
    );
  });

  it("sizes itself in dots through a custom property, 12 by default", () => {
    const twelve = render(Icon, { props: { name: "star" } });
    const el = twelve.container.firstElementChild as SVGSVGElement;
    expect(el.style.getPropertyValue("--icon-dots")).toBe("12");
    twelve.unmount();

    const eight = render(Icon, { props: { name: "star", dots: 8 } });
    expect(
      (
        eight.container.firstElementChild as SVGSVGElement
      ).style.getPropertyValue("--icon-dots"),
    ).toBe("8");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Icon, {
      props: { name: "check", id: "tick", class: "extra" },
    });
    const svg = container.firstElementChild as SVGSVGElement;
    expect(svg).toHaveAttribute("id", "tick");
    expect(svg).toHaveClass("extra");
  });
});
