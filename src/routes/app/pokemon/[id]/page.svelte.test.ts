import { render, screen, within } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { goto } from "$app/navigation";
import { createDeck } from "$lib/components/nav/deck.svelte";
import { findPokemon } from "$lib/fixtures/pokemon";
import DeckHarness from "$lib/testing/DeckHarness.svelte";
import Page from "./+page.svelte";

vi.mock("$app/navigation", () => ({ goto: vi.fn() }));

function dataFor(id: number) {
  return { pokemon: findPokemon(id) ?? null, id, inverted: true };
}

function renderPage(data = dataFor(1)) {
  const deck = createDeck();
  const result = render(DeckHarness, {
    props: { screen: Page, screenProps: { data }, deck },
  });
  return { ...result, deck };
}

function favoriteButton() {
  return screen.getByRole("button", { name: "Favorite" });
}

describe("detail", () => {
  beforeEach(() => {
    vi.mocked(goto).mockClear();
  });

  it("renders the entry: name, number, types, height and weight", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Bulbasaur" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.tagName === "SPAN" &&
          el.textContent?.replace(/\s+/g, " ").trim() === "No. 001",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Seed Pokémon")).toBeInTheDocument();
    expect(screen.getByText("Grass")).toHaveAttribute("data-type", "grass");
    expect(screen.getByText("Poison")).toHaveAttribute("data-type", "poison");
    expect(screen.getByText(`2'04"`)).toBeInTheDocument();
    expect(screen.getByText("15.2 lb")).toBeInTheDocument();
    expect(screen.getByAltText("Bulbasaur")).toHaveAttribute(
      "src",
      findPokemon(1)?.sprite,
    );
  });

  it("shows six stat meters with the fixture values", () => {
    renderPage();

    const meters = screen.getAllByRole("meter");
    expect(meters).toHaveLength(6);
    expect(meters.map((m) => m.getAttribute("aria-label"))).toEqual([
      "HP",
      "Attack",
      "Defense",
      "Special Attack",
      "Special Defense",
      "Speed",
    ]);
    expect(meters.map((m) => m.getAttribute("aria-valuenow"))).toEqual([
      "45",
      "49",
      "49",
      "65",
      "65",
      "45",
    ]);
  });

  it("toggles the favourite by click and by the A button", async () => {
    const user = userEvent.setup();
    const { deck } = renderPage();
    await tick();

    expect(favoriteButton()).toHaveAttribute("aria-pressed", "false");
    await user.click(favoriteButton());
    expect(favoriteButton()).toHaveAttribute("aria-pressed", "true");

    deck.press("a");
    await tick();
    expect(favoriteButton()).toHaveAttribute("aria-pressed", "false");
  });

  it("pages with left and right and backs out with B", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("right");
    expect(goto).toHaveBeenCalledWith("/app/pokemon/2");

    deck.press("left");
    expect(goto).toHaveBeenCalledTimes(1);

    deck.press("b");
    expect(goto).toHaveBeenCalledWith("/app/search");
  });

  it("links Next to the following entry in fixture order", () => {
    renderPage(dataFor(9));

    expect(screen.getByRole("link", { name: "Next: Pikachu" })).toHaveAttribute(
      "href",
      "/app/pokemon/25",
    );
  });

  it("switches tabs to moves and evolution", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("tab", { name: "Moves" }));
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getAllByRole("listitem")).toHaveLength(4);
    expect(within(panel).getByText("Vine Whip")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Evolution" }));
    const rows = within(screen.getByRole("tabpanel")).getAllByRole("link");
    expect(rows).toHaveLength(3);
    expect(rows[2]).toHaveAttribute("href", "/app/pokemon/3");
    expect(rows[2]).toHaveTextContent("Venusaur");
  });

  it("keeps favourites per id when data changes for the next entry", async () => {
    const user = userEvent.setup();
    const { rerender } = renderPage();

    await user.click(favoriteButton());
    expect(favoriteButton()).toHaveAttribute("aria-pressed", "true");

    await rerender({ screenProps: { data: dataFor(2) } });

    expect(
      screen.getByRole("heading", { level: 1, name: "Ivysaur" }),
    ).toBeInTheDocument();
    expect(favoriteButton()).toHaveAttribute("aria-pressed", "false");
  });

  it("renders an empty state for an unknown id", async () => {
    const { deck } = renderPage(dataFor(999));
    await tick();

    expect(
      screen.getByRole("heading", { level: 1, name: "Pokédex" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No entry 999")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Browse Pokédex" }),
    ).toHaveAttribute("href", "/app/search");
    expect(screen.queryAllByRole("meter")).toHaveLength(0);

    deck.press("b");
    expect(goto).toHaveBeenCalledWith("/app/search");
  });
});
