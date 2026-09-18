import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import GameBoy from "./GameBoy.svelte";

describe("GameBoy", () => {
  it("renders every deck button with an accessible name", async () => {
    render(GameBoy);

    for (const name of [
      "Up",
      "Down",
      "Left",
      "Right",
      "A",
      "B",
      "Start",
      "Select",
    ]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("shows a held button as pressed, on the cross for a direction", async () => {
    const { container, rerender } = render(GameBoy, {
      props: { pressed: "down" },
    });

    const dpad = container.querySelector(".gb-dpad");
    const a = screen.getByRole("button", { name: "A" });
    const start = screen.getByRole("button", { name: "Start" });

    expect(dpad).toHaveClass("is-pressed");
    expect(container.querySelectorAll(".is-pressed")).toHaveLength(1);

    await rerender({ pressed: "a" });
    expect(dpad).not.toHaveClass("is-pressed");
    expect(a).toHaveClass("is-pressed");
    expect(container.querySelectorAll(".is-pressed")).toHaveLength(1);

    await rerender({ pressed: "start" });
    expect(start).toHaveClass("is-pressed");
    expect(container.querySelectorAll(".is-pressed")).toHaveLength(1);

    await rerender({ pressed: null });
    expect(container.querySelector(".is-pressed")).toBeNull();
  });

  it("reports which deck button was pressed", async () => {
    const onpress = vi.fn();
    render(GameBoy, { props: { onpress } });

    await userEvent.click(screen.getByRole("button", { name: "A" }));
    expect(onpress).toHaveBeenCalledWith("a");

    await userEvent.click(screen.getByRole("button", { name: "Up" }));
    expect(onpress).toHaveBeenCalledWith("up");
  });
});
