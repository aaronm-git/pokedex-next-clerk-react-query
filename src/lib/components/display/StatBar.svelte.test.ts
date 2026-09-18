import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import StatBar from "./StatBar.svelte";

describe("StatBar", () => {
  it("renders a meter with label, track, fill, and value", () => {
    const { container } = render(StatBar, {
      props: { label: "HP", value: 45 },
    });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-bar");
    expect(el).toHaveAttribute("role", "meter");
    expect(el).toHaveAttribute("aria-valuenow", "45");
    expect(el).toHaveAttribute("aria-valuemin", "0");
    expect(el).toHaveAttribute("aria-valuemax", "255");
    expect(el).toHaveAttribute("aria-label", "HP");

    expect(el.querySelector(".dex-bar__label")).toHaveTextContent("HP");
    expect(el.querySelector(".dex-bar__track .dex-bar__fill")).not.toBeNull();
    expect(el.querySelector(".dex-bar__value")).toHaveTextContent("45");
  });

  it("sets --value as a percentage of max", () => {
    const { container } = render(StatBar, {
      props: { label: "Atk", value: 51, max: 200 },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue("--value")).toBe("25.5");
    expect(el).toHaveAttribute("aria-valuemax", "200");
  });

  it("clamps --value to 0..100", () => {
    const over = render(StatBar, { props: { label: "HP", value: 300 } });
    expect(
      (over.container.firstElementChild as HTMLElement).style.getPropertyValue(
        "--value",
      ),
    ).toBe("100");

    const under = render(StatBar, { props: { label: "HP", value: -5 } });
    expect(
      (under.container.firstElementChild as HTMLElement).style.getPropertyValue(
        "--value",
      ),
    ).toBe("0");
  });

  it("marks low below 60, mid below 100, and nothing at 100 or above", () => {
    const low = render(StatBar, { props: { label: "Spd", value: 59 } });
    expect(low.container.firstElementChild).toHaveAttribute(
      "data-level",
      "low",
    );

    const mid = render(StatBar, { props: { label: "Spd", value: 60 } });
    expect(mid.container.firstElementChild).toHaveAttribute(
      "data-level",
      "mid",
    );

    const midTop = render(StatBar, { props: { label: "Spd", value: 99 } });
    expect(midTop.container.firstElementChild).toHaveAttribute(
      "data-level",
      "mid",
    );

    const high = render(StatBar, { props: { label: "Spd", value: 100 } });
    expect(high.container.firstElementChild).not.toHaveAttribute("data-level");
  });

  it("uses name for the accessible name when given", () => {
    const { container } = render(StatBar, {
      props: { label: "Atk", name: "Attack", value: 80 },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("aria-label", "Attack");
    expect(el.querySelector(".dex-bar__label")).toHaveTextContent("Atk");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(StatBar, {
      props: { label: "HP", value: 45, id: "hp", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "hp");
    expect(el).toHaveClass("dex-bar", "extra");
  });
});
