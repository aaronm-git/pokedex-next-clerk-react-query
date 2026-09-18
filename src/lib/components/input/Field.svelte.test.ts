import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Field from "./Field.svelte";

describe("Field", () => {
  it("renders a labelled text input with no help, error or search chrome by default", () => {
    const { container } = render(Field, { props: { label: "Email" } });

    expect(container.children).toHaveLength(1);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper).toHaveClass("dex-field");
    expect(wrapper).not.toHaveClass("dex-field--search");
    expect(wrapper.querySelector(".dex-field__row")).toBeNull();
    expect(wrapper.querySelector(".dex-field__help")).toBeNull();
    expect(wrapper.querySelector(".dex-field__error")).toBeNull();
    expect(wrapper.querySelector("button")).toBeNull();

    const input = screen.getByLabelText("Email") as HTMLInputElement;
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveClass("dex-field__input");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("id");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(input).not.toBeDisabled();

    const label = wrapper.querySelector("label") as HTMLLabelElement;
    expect(label).toHaveClass("dex-field__label");
    expect(label).not.toHaveClass("visually-hidden");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("keeps the label in the DOM but visually hidden when hideLabel is set", () => {
    const { container } = render(Field, {
      props: { label: "Search", hideLabel: true },
    });

    const label = container.querySelector("label") as HTMLLabelElement;
    expect(label).toHaveClass("dex-field__label", "visually-hidden");
    expect(label).toHaveTextContent("Search");
    expect(screen.getByLabelText("Search").tagName).toBe("INPUT");
  });

  it("uses the given id and type", () => {
    render(Field, {
      props: { label: "Email", id: "login-email", type: "email" },
    });

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "login-email");
    expect(input).toHaveAttribute("type", "email");
  });

  it("puts the initial value in the input and updates it as the user types", async () => {
    const user = userEvent.setup();
    const oninput = vi.fn();
    render(Field, { props: { label: "Email", value: "ash@", oninput } });

    const input = screen.getByLabelText("Email") as HTMLInputElement;
    expect(input.value).toBe("ash@");

    await user.type(input, "pallet.town");

    expect(input.value).toBe("ash@pallet.town");
    expect(oninput).toHaveBeenCalledTimes("pallet.town".length);
  });

  it("renders help and links it with aria-describedby", () => {
    const { container } = render(Field, {
      props: { label: "Email", id: "f1", help: "We send a one-time link." },
    });

    const help = container.querySelector(".dex-field__help") as HTMLElement;
    expect(help.tagName).toBe("P");
    expect(help).toHaveAttribute("id", "f1-help");
    expect(help).toHaveTextContent("We send a one-time link.");

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-describedby", "f1-help");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("renders the error, marks the input invalid and describes it by the error", () => {
    const { container } = render(Field, {
      props: { label: "Email", id: "f3", error: "Enter a full address" },
    });

    const error = container.querySelector(".dex-field__error") as HTMLElement;
    expect(error.tagName).toBe("P");
    expect(error).toHaveAttribute("id", "f3-error");
    expect(error).toHaveTextContent("Enter a full address");

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "f3-error");
  });

  it("describes the input by help then error when both are present", () => {
    render(Field, {
      props: { label: "Email", id: "f3", help: "Help", error: "Bad" },
    });

    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-describedby",
      "f3-help f3-error",
    );
  });

  it("renders the search variant with a row and a submit button", () => {
    const { container } = render(Field, {
      props: { label: "Search", search: true, type: "text" },
    });

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass("dex-field", "dex-field--search");

    const input = screen.getByLabelText("Search");
    expect(input).toHaveAttribute("type", "search");
    expect(input.parentElement).toHaveClass("dex-field__row");

    const go = screen.getByRole("button", { name: "Go" });
    expect(go).toHaveClass("dex-btn");
    expect(go).toHaveAttribute("type", "submit");
    expect(go.parentElement).toBe(input.parentElement);
    expect(go).not.toBeDisabled();
  });

  it("names the search button after action", () => {
    render(Field, { props: { label: "Search", search: true, action: "Find" } });

    expect(screen.getByRole("button", { name: "Find" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.queryByRole("button", { name: "Go" })).toBeNull();
  });

  it("puts rest attributes and extra classes on the input, not the wrapper", () => {
    const { container } = render(Field, {
      props: {
        label: "Email",
        name: "email",
        autocomplete: "email",
        required: true,
        placeholder: "ash@pallet.town",
        class: "extra",
      },
    });

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("autocomplete", "email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("placeholder", "ash@pallet.town");
    expect(input).toHaveClass("dex-field__input", "extra");
    expect(container.firstElementChild).not.toHaveClass("extra");
  });

  it("disables the input and the search button", () => {
    render(Field, { props: { label: "Search", search: true, disabled: true } });

    expect(screen.getByLabelText("Search")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Go" })).toBeDisabled();
  });
});
