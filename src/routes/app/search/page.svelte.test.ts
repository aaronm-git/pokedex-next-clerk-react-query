import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { goto } from "$app/navigation";
import { createDeck } from "$lib/components/nav/deck.svelte";
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

const rows = () => document.querySelectorAll<HTMLElement>(".dex-row");
const numbers = () =>
  Array.from(rows(), (row) => row.querySelector(".dex-row__no")?.textContent);
const current = () => document.querySelector<HTMLElement>("[aria-current]");

async function type(text: string) {
  await userEvent.type(screen.getByRole("searchbox", { name: "Search" }), text);
}

beforeEach(() => {
  vi.mocked(goto).mockClear();
});

describe("search", () => {
  it("renders every fixture row with the first one current", () => {
    renderPage();

    expect(rows()).toHaveLength(17);
    expect(current()).toHaveTextContent("001");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("BBack");
    expect(screen.queryByText(/match/)).not.toBeInTheDocument();
  });

  it("filters by name and shows the match line", async () => {
    renderPage();
    await type("char");

    expect(numbers()).toEqual(["004", "005", "006"]);
    const badges = Array.from(document.querySelectorAll(".dex-type"), (b) =>
      b.getAttribute("data-type"),
    );
    expect(badges).toEqual(["fire", "fire", "fire", "flying"]);
    expect(screen.getByText('3 of 17 match "char"')).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toHaveTextContent("BClear");
  });

  it("filters by number", async () => {
    renderPage();
    await type("25");

    expect(numbers()).toEqual(["025"]);
    expect(rows()[0]).toHaveTextContent("Pikachu");
  });

  it("keeps only owned ids on the Owned tab", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("tab", { name: "Owned" }));

    expect(numbers()).toEqual(TRAINER.owned.map(padNo));
  });

  it("counts matches against the tab's pool, not the whole dex", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("tab", { name: "Owned" }));
    await type("char");

    // Charmander and Charmeleon are owned, Charizard is not.
    expect(numbers()).toEqual(["004", "005"]);
    expect(
      screen.getByText(`2 of ${TRAINER.owned.length} match "char"`),
    ).toBeInTheDocument();
  });

  it("moves the cursor down on the deck", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("down");
    await tick();
    expect(current()).toHaveTextContent("002");
  });

  it("opens the current row on A", async () => {
    const { deck } = renderPage();
    await tick();

    deck.press("down");
    deck.press("a");
    expect(goto).toHaveBeenCalledWith("/app/pokemon/2");
  });

  it("clears the query on B, then goes back on a second B", async () => {
    const { deck } = renderPage();
    await tick();
    await type("char");
    expect(rows()).toHaveLength(3);

    deck.press("b");
    await tick();
    expect(rows()).toHaveLength(17);
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(goto).not.toHaveBeenCalled();

    deck.press("b");
    expect(goto).toHaveBeenCalledWith("/app/dashboard");
  });

  it("shows the empty state when nothing matches and A does nothing", async () => {
    const { deck } = renderPage();
    await tick();
    await type("zzz");

    expect(rows()).toHaveLength(0);
    expect(screen.getByText("No match")).toBeInTheDocument();
    expect(screen.getByText('0 of 17 match "zzz"')).toBeInTheDocument();

    deck.press("a");
    expect(goto).not.toHaveBeenCalled();
  });
});
