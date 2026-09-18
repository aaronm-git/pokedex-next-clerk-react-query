import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Kv from "./Kv.svelte";

const rows = [
  { label: "HT", value: "2'04\"" },
  { label: "WT", value: "15.2 lb" },
];

describe("Kv", () => {
  it("renders a dl with a dt/dd pair per row", () => {
    const { container } = render(Kv, { props: { rows } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DL");
    expect(el).toHaveClass("dex-kv");

    const dts = el.querySelectorAll("dt");
    const dds = el.querySelectorAll("dd");
    expect(dts).toHaveLength(2);
    expect(dds).toHaveLength(2);
    expect(dts[0]).toHaveTextContent("HT");
    expect(dds[0]).toHaveTextContent("2'04\"");
    expect(dts[1]).toHaveTextContent("WT");
    expect(dds[1]).toHaveTextContent("15.2 lb");
    expect(el.children[0].tagName).toBe("DT");
    expect(el.children[1].tagName).toBe("DD");
  });

  it("renders an empty dl for no rows", () => {
    const { container } = render(Kv, { props: { rows: [] } });

    expect(container.firstElementChild?.children).toHaveLength(0);
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Kv, {
      props: {
        rows,
        id: "stats",
        "aria-label": "Measurements",
        class: "extra",
      },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "stats");
    expect(el).toHaveAttribute("aria-label", "Measurements");
    expect(el).toHaveClass("dex-kv", "extra");
  });
});
