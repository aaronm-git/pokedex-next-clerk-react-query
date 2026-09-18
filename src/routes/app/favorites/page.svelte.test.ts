import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

const rows = () => document.querySelectorAll<HTMLElement>(".dex-row");
const numbers = () =>
  Array.from(rows(), (row) => row.querySelector(".dex-row__no")?.textContent);
const current = () => document.querySelector<HTMLElement>("[aria-current]");
const removeButton = () => screen.getByRole("button", { name: /^Remove / });
const toast = () => screen.queryByRole("status");

beforeEach(() => {
  vi.mocked(goto).mockClear();
});

describe("favorites", () => {
  it("renders the saved rows with thumbs, the count and no toast", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Favorites" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveTextContent("3 saved");
    expect(numbers()).toEqual(["025", "094", "143"]);
    for (const row of rows()) {
      expect(row).toHaveClass("dex-row--thumb");
      expect(row.querySelector(".dex-row__thumb")).toBeInTheDocument();
    }
    expect(rows()[0]).toHaveAttribute("href", "/app/pokemon/25");
    expect(current()).toHaveTextContent("Pikachu");
    expect(removeButton()).toHaveAccessibleName("Remove Pikachu");
    expect(removeButton()).toHaveClass("dex-btn--danger", "dex-btn--sm");
    expect(toast()).not.toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "AOpenSelectRemoveBBack",
    );
  });

  it("renames the remove button as the cursor moves", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("down");
    await tick();
    expect(current()).toHaveTextContent("Gengar");
    expect(removeButton()).toHaveAccessibleName("Remove Gengar");
  });

  it("removes the current row from the button and shows the toast", async () => {
    const { deck } = renderPage();
    await tick();
    deck.press("down");
    await tick();

    await userEvent.click(removeButton());

    expect(numbers()).toEqual(["025", "143"]);
    expect(screen.getByRole("banner")).toHaveTextContent("2 saved");
    expect(toast()).toHaveTextContent("Removed Gengar");
    expect(current()).toHaveTextContent("Snorlax");
    expect(removeButton()).toHaveAccessibleName("Remove Snorlax");
  });

  it("removes the current row on select", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("select");
    await tick();

    expect(numbers()).toEqual(["094", "143"]);
    expect(toast()).toHaveTextContent("Removed Pikachu");
    expect(current()).toHaveTextContent("Gengar");
  });

  it("clamps the cursor when the last row goes", async () => {
    const { deck } = renderPage();
    await tick();
    deck.press("down");
    deck.press("down");
    await tick();
    expect(current()).toHaveTextContent("Snorlax");

    deck.press("select");
    await tick();

    expect(numbers()).toEqual(["025", "094"]);
    expect(current()).toHaveTextContent("Gengar");
  });

  it("shows the empty state and focuses the browse link once all are gone", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("select");
    deck.press("select");
    deck.press("select");
    await tick();
    await tick();

    expect(rows()).toHaveLength(0);
    expect(screen.queryByRole("button", { name: /^Remove / })).toBeNull();
    expect(screen.getByRole("banner")).not.toHaveTextContent("saved");
    expect(screen.getByText("No favorites yet")).toBeInTheDocument();
    const browse = screen.getByRole("link", { name: "Browse Pokédex" });
    expect(browse).toHaveAttribute("href", "/app/search");
    expect(browse).toHaveFocus();
    expect(toast()).toHaveTextContent("Removed Snorlax");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("BBack");
    expect(screen.getByRole("contentinfo")).not.toHaveTextContent("Remove");

    // Nothing left to remove: select is a no-op.
    deck.press("select");
    await tick();
    expect(toast()).toHaveTextContent("Removed Snorlax");
  });

  it("opens the current row on A and goes back to the dashboard on B", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("down");
    deck.press("a");
    expect(goto).toHaveBeenCalledWith("/app/pokemon/94");

    deck.press("b");
    expect(goto).toHaveBeenCalledWith("/app/dashboard");
    expect(goto).toHaveBeenCalledTimes(2);
  });

  it("moves the cursor on a row click without calling goto", async () => {
    renderPage();
    await tick();

    await userEvent.click(rows()[2]);

    expect(current()).toHaveTextContent("Snorlax");
    expect(removeButton()).toHaveAccessibleName("Remove Snorlax");
    expect(goto).not.toHaveBeenCalled();
  });
});
