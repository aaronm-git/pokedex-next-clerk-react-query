import { render, screen, within } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { goto } from "$app/navigation";
import { createDeck } from "$lib/components/nav/deck.svelte";
import { findPokemon, KANTO_COUNT } from "$lib/fixtures/pokemon";
import { TRAINER } from "$lib/fixtures/trainer";
import { padNo } from "$lib/pokemon/format";
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

function menuLinks() {
  return within(
    screen.getByRole("navigation", { name: "Sections" }),
  ).getAllByRole("link");
}

function currentLabels() {
  return menuLinks()
    .filter((link) => link.getAttribute("aria-current") === "true")
    .map((link) => link.textContent?.trim());
}

function card(label: string): HTMLElement {
  const root = screen.getByText(label, { selector: ".dex-card__label" });
  const found = root.closest(".dex-card");
  if (!(found instanceof HTMLElement)) throw new Error(`no card ${label}`);
  return found;
}

const seen = TRAINER.seen.length;
const favorites = TRAINER.favorites.length;

describe("dashboard", () => {
  beforeEach(() => {
    vi.mocked(goto).mockClear();
  });

  it("renders the header from the trainer", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Trainer" }),
    ).toBeInTheDocument();
    expect(screen.getByText(TRAINER.email)).toBeInTheDocument();
  });

  it("renders three cards with values derived from the fixtures", () => {
    renderPage();

    const seenCard = card("Seen");
    expect(seenCard.tagName).toBe("A");
    expect(seenCard).toHaveAttribute("href", "/app/search");
    expect(within(seenCard).getByText(String(seen))).toHaveClass(
      "dex-card__value",
    );
    expect(
      within(seenCard).getByText(`${KANTO_COUNT - seen} to go`),
    ).toHaveClass("dex-card__caption");

    const favoritesCard = card("Favorites");
    expect(favoritesCard.tagName).toBe("A");
    expect(favoritesCard).toHaveAttribute("href", "/app/favorites");
    expect(within(favoritesCard).getByText(String(favorites))).toHaveClass(
      "dex-card__value",
    );
    const newest = findPokemon(TRAINER.favorites.at(-1) ?? 0)?.name;
    expect(within(favoritesCard).getByText(`Latest: ${newest}`)).toHaveClass(
      "dex-card__caption",
    );

    const lastViewed = card("Last viewed");
    expect(lastViewed.tagName).toBe("DIV");
    expect(lastViewed).toHaveClass("dex-card--inverted");
    expect(lastViewed).not.toHaveAttribute("href");
    const last = within(lastViewed);
    expect(last.getByText(padNo(TRAINER.lastViewed))).toHaveClass(
      "dex-card__value",
    );
    expect(
      last.getByText(findPokemon(TRAINER.lastViewed)?.name ?? ""),
    ).toHaveClass("dex-card__caption");
  });

  it("renders the menu with three links and the favorites hint", () => {
    renderPage();

    const links = menuLinks();
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/app/search");
    expect(links[0]).toHaveTextContent("Browse Pokédex");
    expect(links[1]).toHaveAttribute("href", "/app/favorites");
    expect(links[1]).toHaveTextContent(`Favorites ${favorites}`);
    expect(links[2]).toHaveAttribute("href", "/");
    expect(links[2]).toHaveTextContent("Log out");
  });

  it("shows only 'A Open' in the hints", () => {
    renderPage();

    const hints = screen.getByRole("contentinfo");
    expect(hints).toHaveTextContent("AOpen");
    expect(hints).not.toHaveTextContent("Zoom");
    expect(within(hints).getAllByText(/./, { selector: "kbd" })).toHaveLength(
      1,
    );
  });

  it("starts with the first item current", () => {
    renderPage();

    expect(currentLabels()).toEqual(["Browse Pokédex"]);
  });

  it("moves the cursor to the second item on down and nowhere else", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("down");
    await tick();

    expect(currentLabels()).toEqual([`Favorites ${favorites}`]);
    expect(goto).not.toHaveBeenCalled();
  });

  it("opens the item under the cursor on A", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("down");
    await tick();
    deck.press("a");

    expect(goto).toHaveBeenCalledTimes(1);
    expect(goto).toHaveBeenCalledWith("/app/favorites");
  });

  it("ignores B: there is nowhere back to go", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("b");
    expect(goto).not.toHaveBeenCalled();
  });

  it("moves the cursor on click and lets the link navigate itself", async () => {
    const user = userEvent.setup();
    renderPage();
    await tick();

    await user.click(menuLinks()[2]);

    expect(currentLabels()).toEqual(["Log out"]);
    expect(goto).not.toHaveBeenCalled();
  });
});
