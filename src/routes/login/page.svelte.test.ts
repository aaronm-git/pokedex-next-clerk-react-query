import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
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

const emailField = () => screen.getByLabelText("Email");
const sendButton = () => screen.getByRole("button", { name: "Send link" });

describe("login", () => {
  it("renders the header, the labelled email input and the submit button", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { level: 1, name: "Log in" }),
    ).toBeInTheDocument();
    expect(emailField()).toHaveAttribute("type", "email");
    expect(emailField()).toBeRequired();
    expect(sendButton()).toHaveAttribute("type", "submit");
  });

  it("shows the sent notice with the typed email and hides the form on submit", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(emailField(), "ash@pallet.town");
    await user.click(sendButton());

    const notice = screen.getByRole("status");
    expect(notice).toHaveTextContent("Link sent");
    expect(notice).toHaveTextContent("Check ash@pallet.town.");
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Use a different email" }),
    ).toBeInTheDocument();
  });

  it("submits on Enter inside the field", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(emailField(), "ash@pallet.town{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Check ash@pallet.town.",
    );
  });

  it("returns to the form with the input focused and the email kept", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(emailField(), "ash@pallet.town");
    await user.click(sendButton());
    await user.click(
      screen.getByRole("button", { name: "Use a different email" }),
    );
    await tick();

    expect(emailField()).toHaveValue("ash@pallet.town");
    expect(emailField()).toHaveFocus();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("submits from the deck's A with a valid email", async () => {
    const user = userEvent.setup();
    const { deck } = renderPage();
    await tick();
    await user.type(emailField(), "ash@pallet.town");
    deck.press("a");
    await tick();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Check ash@pallet.town.",
    );
  });

  it("does not submit from the deck's A with an empty field", async () => {
    const { deck } = renderPage();
    await tick();
    deck.press("a");
    await tick();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(emailField()).toBeInTheDocument();
  });

  it("does not submit from the deck's A with a malformed email", async () => {
    const user = userEvent.setup();
    const { deck } = renderPage();
    await tick();
    await user.type(emailField(), "not-an-email");
    deck.press("a");
    await tick();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("goes back to the landing page on B from the form", async () => {
    const { deck } = renderPage();
    await tick();
    deck.press("b");
    expect(goto).toHaveBeenCalledWith("/");
  });

  it("returns to the form on B from the sent state without navigating", async () => {
    const user = userEvent.setup();
    const { deck } = renderPage();
    await tick();
    await user.type(emailField(), "ash@pallet.town");
    await user.click(sendButton());
    deck.press("b");
    await tick();
    await tick();

    expect(goto).not.toHaveBeenCalled();
    expect(emailField()).toHaveValue("ash@pallet.town");
    expect(emailField()).toHaveFocus();
  });

  it("shows A Send and B Back on the form, only B Back once sent", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    const hints = () => container.querySelector(".dex-hints")?.textContent;
    expect(hints()).toBe("ASendBBack");
    await user.type(emailField(), "ash@pallet.town{Enter}");
    expect(hints()).toBe("BBack");
  });
});
