import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Rule from "./Rule.svelte";

describe("Rule", () => {
  it("renders a single hr separator with the base class", () => {
    const { container } = render(Rule);

    expect(container.children).toHaveLength(1);
    const rule = screen.getByRole("separator");
    expect(rule.tagName).toBe("HR");
    expect(rule).toHaveClass("dex-rule");
    expect(rule).not.toHaveClass("dex-rule--dashed");
  });

  it("toggles the dashed modifier", () => {
    const solid = render(Rule, { props: { dashed: false } });
    expect(solid.container.firstElementChild).not.toHaveClass(
      "dex-rule--dashed",
    );
    solid.unmount();

    render(Rule, { props: { dashed: true } });
    expect(screen.getByRole("separator")).toHaveClass(
      "dex-rule",
      "dex-rule--dashed",
    );
  });

  it("passes rest attributes and extra classes through", () => {
    render(Rule, {
      props: { id: "divider", "aria-label": "Section break", class: "extra" },
    });

    const rule = screen.getByRole("separator");
    expect(rule).toHaveAttribute("id", "divider");
    expect(rule).toHaveAttribute("aria-label", "Section break");
    expect(rule).toHaveClass("dex-rule", "extra");
  });
});
