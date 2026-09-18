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

  it("reports which deck button was pressed", async () => {
    const onpress = vi.fn();
    render(GameBoy, { props: { onpress } });

    await userEvent.click(screen.getByRole("button", { name: "A" }));
    expect(onpress).toHaveBeenCalledWith("a");

    await userEvent.click(screen.getByRole("button", { name: "Up" }));
    expect(onpress).toHaveBeenCalledWith("up");
  });
});
