import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { goto } from "$app/navigation";
import { TOAST_DURATION_MS } from "$lib/components/display/Toast.svelte";
import { createDeck } from "$lib/components/nav/deck.svelte";
import { ICON_PATHS } from "$lib/icons/paths";
import DeckHarness from "$lib/testing/DeckHarness.svelte";
import Page from "./+page.svelte";
import Inverted from "./inverted/+page.svelte";

vi.mock("$app/navigation", () => ({ goto: vi.fn() }));

function renderPage(page: typeof Page = Page) {
  const deck = createDeck();
  const result = render(DeckHarness, {
    props: { screen: page, screenProps: {}, deck },
  });
  return { ...result, deck };
}

const headings = (level: number) =>
  screen.getAllByRole("heading", { level }).map((h) => h.textContent?.trim());
const tocCurrent = () =>
  document
    .querySelector('nav[aria-label="Sections"] [aria-current="true"]')
    ?.textContent?.trim();

// The static guide's groups, in its order, and the additions since it was
// written. Every group is a heading on the page.
const SECTIONS = [
  "Palette",
  "Type",
  "Device",
  "Layout",
  "Components",
  "Screens",
];
const GROUPS = [
  "Box",
  "Header",
  "Menu",
  "Button",
  "Field",
  "Row and list",
  "Sprite well",
  "Stat bar",
  "Tabs",
  "Card",
  "Notice and toast",
  "Hints, key/value, rule",
  "Empty and loading",
  "Icon",
];

// One selector per component. GameBoy is the shell around the page, not in
// it, so the page renders 31 of the 32; the layout test covers the shell.
const COMPONENTS: Record<string, string> = {
  Stack: ".dex-stack",
  Cluster: ".dex-cluster",
  Split: ".dex-split",
  Grid: ".dex-grid",
  ScreenBody: ".dex-screen-body",
  Rule: "hr.dex-rule",
  Ball: "i.dex-ball",
  Bars: ".dex-bars",
  Box: ".dex-box",
  Card: ".dex-card",
  Empty: ".dex-empty",
  Header: "header.dex-header",
  Hints: "footer.dex-hints",
  Icon: 'svg[viewBox="0 0 24 24"]',
  Kv: "dl.dex-kv",
  Loading: ".dex-loading",
  Notice: ".dex-notice",
  Skeleton: ".dex-skeleton",
  Sprite: ".dex-sprite img",
  StatBar: '.dex-bar[role="meter"]',
  Toast: ".dex-toast",
  TypeBadge: ".dex-type[data-type]",
  Types: ".dex-types",
  Button: "button.dex-btn",
  ButtonGroup: ".dex-btn-group",
  Field: ".dex-field input.dex-field__input",
  List: ".dex-list",
  Menu: "nav.dex-menu",
  Row: ".dex-row",
  Tabs: '.dex-tabs[role="tablist"]',
  Deck: '.gb-deck[role="group"]',
};

// Every modifier and state the design system draws, as the page renders it.
const STATES = [
  ".dex-box--thick",
  ".dex-box--single",
  ".dex-box--inverted",
  ".dex-box--flush",
  ".dex-box__title",
  ".dex-header__meta b",
  ".dex-menu--row",
  ".dex-menu__hint",
  '.dex-menu__item[aria-disabled="true"]',
  ".dex-btn--primary",
  ".dex-btn--danger",
  ".dex-btn--start",
  ".dex-btn--sm",
  ".dex-btn--block",
  ".dex-btn.is-loading[aria-busy]",
  '.dex-btn[aria-pressed="true"]',
  ".dex-btn:disabled",
  "a.dex-btn[href]",
  'a.dex-btn[aria-disabled="true"]:not([href])',
  ".dex-field--search",
  ".dex-field__help",
  ".dex-field__error",
  '.dex-field__input[aria-invalid="true"]',
  ".dex-field__input:disabled",
  ".dex-field__label.visually-hidden",
  ".dex-ball--filled",
  ".dex-row--unseen",
  ".dex-row--thumb",
  'a.dex-row[aria-current="true"]',
  "button.dex-row",
  ".dex-sprite--lg",
  ".dex-sprite--inverted",
  '.dex-sprite img[loading="eager"]',
  '.dex-bar[data-level="mid"]',
  '.dex-bar[data-level="low"]',
  ".dex-bar:not([data-level])",
  ".dex-tabpanel",
  ".dex-card--link",
  ".dex-card--inverted",
  ".dex-notice--ok",
  ".dex-notice--warn",
  ".dex-notice--error",
  '.dex-notice[role="alert"]',
  ".dex-rule--dashed",
  ".dex-stack--tight",
  ".dex-grid--2",
  ".dex-grid--3",
  ".dex-empty p",
  ".dex-loading p",
  ".dex-stack--tight > .dex-skeleton",
  ".gb-dpad.is-pressed",
  'svg[role="img"][aria-label]',
  'svg[aria-hidden="true"]',
  ".t-cursor",
  ".t-display-xl",
];

beforeEach(() => {
  vi.mocked(goto).mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("styleguide", () => {
  it("groups the page the way the static guide does", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Design system" }),
    ).toBeInTheDocument();
    // Section headings, in order; the Header demos add h2s of their own.
    const h2 = headings(2);
    expect(h2.filter((h) => SECTIONS.includes(h ?? ""))).toEqual(SECTIONS);
    expect(headings(3)).toEqual(GROUPS);
    for (const id of SECTIONS.map((s) => s.toLowerCase())) {
      expect(document.getElementById(id)).toHaveAttribute("tabindex", "-1");
    }
  });

  it("renders every component", () => {
    const { container } = renderPage();

    const missing = Object.entries(COMPONENTS)
      .filter(([, selector]) => container.querySelector(selector) === null)
      .map(([name]) => name);
    expect(missing).toEqual([]);
  });

  it("renders every modifier and state", () => {
    const { container } = renderPage();

    const missing = STATES.filter((s) => container.querySelector(s) === null);
    expect(missing).toEqual([]);
  });

  it("shows all eighteen type colours plus the fallback, and every icon", () => {
    renderPage();

    const badges = document.querySelectorAll(".dex-types .dex-type");
    expect(badges).toHaveLength(19);
    expect(
      new Set([...badges].map((b) => b.getAttribute("data-type"))),
    ).toHaveProperty("size", 19);
    expect(badges[18]).toHaveAttribute("data-type", "???");

    const names = Object.keys(ICON_PATHS);
    const labelled = screen.getAllByRole("img", {
      name: (n) => names.includes(n),
    });
    expect(labelled).toHaveLength(names.length);
  });

  it("drives the sections menu from the deck: down moves, A jumps, B goes home", async () => {
    const { deck } = renderPage();
    await tick();
    expect(tocCurrent()).toBe("Palette");

    deck.press("down");
    deck.press("down");
    await tick();
    expect(tocCurrent()).toBe("Device");
    expect(document.activeElement).toHaveTextContent("Device");

    deck.press("a");
    await tick();
    expect(document.activeElement).toBe(document.getElementById("device"));
    expect(document.activeElement?.tagName).toBe("H2");

    deck.press("b");
    expect(goto).toHaveBeenCalledWith("/");
  });

  it("jumps to a section when its link is clicked, because the router will not scroll the LCD", async () => {
    const user = userEvent.setup();
    renderPage();
    await tick();

    await user.click(screen.getByRole("link", { name: "Components" }));
    expect(tocCurrent()).toBe("Components");
    expect(document.activeElement).toBe(document.getElementById("components"));
  });

  it("keeps focus on the heading when the click did not focus the link first", async () => {
    // Safari and Firefox on macOS do not focus a link on mousedown, so the
    // cursor is still on Palette when the click lands. The index change must
    // not let focus-follows-cursor pull focus back to the menu item.
    renderPage();
    await tick();
    expect(tocCurrent()).toBe("Palette");

    screen.getByRole("link", { name: "Components" }).click();
    await tick();
    expect(tocCurrent()).toBe("Components");
    expect(document.activeElement).toBe(document.getElementById("components"));
  });

  it("keeps the demo menus off the deck", async () => {
    const user = userEvent.setup();
    const { deck } = renderPage();
    await tick();

    const demo = screen.getByRole("navigation", { name: "Menu demo" });
    const cry = demo.querySelector<HTMLElement>("button:nth-of-type(2)");
    expect(cry).toHaveTextContent("Cry");
    await user.click(cry as HTMLElement);
    expect(cry).toHaveAttribute("aria-current", "true");
    expect(tocCurrent()).toBe("Palette");

    deck.press("down");
    await tick();
    expect(tocCurrent()).toBe("Type");
    expect(cry).toHaveAttribute("aria-current", "true");
  });

  it("puts up a dismissing toast on request and takes it down after the duration", async () => {
    vi.useFakeTimers();
    renderPage();
    await tick();
    const toasts = () =>
      [...document.querySelectorAll(".dex-toast")].map((t) => t.textContent);
    expect(toasts()).toHaveLength(1);

    const button = screen.getByRole("button", { name: "Show toast" });
    button.click();
    await tick();
    expect(toasts()).toHaveLength(2);

    vi.advanceTimersByTime(TOAST_DURATION_MS);
    await tick();
    expect(toasts()).toHaveLength(1);
  });

  it("gives every focusable control an accessible name", () => {
    const { container } = renderPage();

    const controls = container.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), [role="tab"]',
    );
    expect(controls.length).toBeGreaterThan(50);
    const unnamed = [...controls].filter((el) => {
      if (el.getAttribute("aria-label") || el.textContent?.trim()) return false;
      return !(el instanceof HTMLInputElement && el.labels?.length);
    });
    expect(unnamed.map((el) => el.outerHTML)).toEqual([]);
  });

  it("links the twin page and the six screens", () => {
    renderPage();

    expect(screen.getByRole("link", { name: "Inverted LCD" })).toHaveAttribute(
      "href",
      "/styleguide/inverted",
    );
    const screens = screen.getByRole("navigation", { name: "Screens" });
    expect(
      [...screens.querySelectorAll("a")].map((a) => a.getAttribute("href")),
    ).toEqual([
      "/",
      "/login",
      "/app/dashboard",
      "/app/search",
      "/app/pokemon/1",
      "/app/favorites",
    ]);
  });

  it("renders the inverted twin with the same content and a link back", () => {
    const { container } = renderPage(Inverted);

    expect(screen.getByRole("link", { name: "Standard LCD" })).toHaveAttribute(
      "href",
      "/styleguide",
    );
    expect(
      screen.getByRole("heading", { level: 1 }).closest("header"),
    ).toHaveTextContent("Inverted LCD");
    expect(headings(3)).toEqual(GROUPS);
    // Captions drop the mid tone on black, where it fails AA.
    expect(container.querySelectorAll(".t-label-xs.t-mid")).toHaveLength(1);
  });
});
