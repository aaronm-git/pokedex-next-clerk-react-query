import { render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { goto } from "$app/navigation";
import { createDeck } from "$lib/components/nav/deck.svelte";
import DeckHarness from "$lib/testing/DeckHarness.svelte";
import Page from "./+page.svelte";

vi.mock("$app/navigation", () => ({ goto: vi.fn() }));

function renderPage() {
  const deck = createDeck();
  const result = render(DeckHarness, {
    props: { screen: Page, screenProps: {}, deck },
  });
  return { ...result, deck };
}

describe("landing", () => {
  it("renders the title, both links and the hints", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Pokédex" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try the demo" })).toHaveAttribute(
      "href",
      "/app/dashboard",
    );
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login",
    );

    const hints = screen.getByRole("contentinfo");
    expect(hints).toHaveTextContent("StartDemo");
    expect(hints).toHaveTextContent("ALog in");
  });

  it("goes to the dashboard on Start", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("start");
    expect(goto).toHaveBeenCalledWith("/app/dashboard");
  });

  it("goes to login on A", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("a");
    expect(goto).toHaveBeenCalledWith("/login");
  });

  it("ignores the D-pad", async () => {
    vi.mocked(goto).mockClear();
    const { deck } = renderPage();
    await tick();

    deck.press("down");
    expect(goto).not.toHaveBeenCalled();
  });
});
