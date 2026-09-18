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

  it("derives the level from the percentage: red to 20%, yellow to 50%, green above", () => {
    // max = 100 so value and percentage read the same.
    const level = (value: number) =>
      (
        render(StatBar, { props: { label: "Spd", value, max: 100 } }).container
          .firstElementChild as HTMLElement
      ).getAttribute("data-level");

    expect(level(0)).toBe("low");
    expect(level(20)).toBe("low");
    expect(level(21)).toBe("mid");
    expect(level(50)).toBe("mid");
    expect(level(51)).toBeNull();
    expect(level(100)).toBeNull();
  });

  it("applies the thresholds against the default max of 255", () => {
    // 51 / 255 = 20% exactly, still red; 128 / 255 is just over 50%, green.
    const level = (value: number) =>
      (
        render(StatBar, { props: { label: "HP", value } }).container
          .firstElementChild as HTMLElement
      ).getAttribute("data-level");

    expect(level(51)).toBe("low");
    expect(level(52)).toBe("mid");
    expect(level(127)).toBe("mid");
    expect(level(128)).toBeNull();
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
