import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Data</span>",
}));

const button = (container: HTMLElement) =>
  container.firstElementChild as HTMLElement;

describe("Button", () => {
  it("renders a plain type=button with only the base class by default", () => {
    const { container } = render(Button, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = button(container);
    expect(el.tagName).toBe("BUTTON");
    expect(el).toHaveAttribute("type", "button");
    expect(el).toHaveTextContent("Data");
    expect(el).toHaveClass("dex-btn");
    expect(el).not.toHaveClass("dex-btn--primary");
    expect(el).not.toHaveClass("dex-btn--danger");
    expect(el).not.toHaveClass("dex-btn--start");
    expect(el).not.toHaveClass("dex-btn--sm");
    expect(el).not.toHaveClass("dex-btn--block");
    expect(el).not.toHaveClass("is-loading");
    expect(el).not.toBeDisabled();
    expect(el).not.toHaveAttribute("aria-pressed");
    expect(el).not.toHaveAttribute("aria-busy");
    expect(el).not.toHaveAttribute("aria-disabled");
    expect(el).not.toHaveAttribute("href");
  });

  it("calls onclick when clicked", async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    const { container } = render(Button, { props: { children, onclick } });

    await user.click(button(container));

    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it("does not call onclick when disabled", async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    const { container } = render(Button, {
      props: { children, onclick, disabled: true },
    });

    const el = button(container);
    expect(el).toBeDisabled();
    await user.click(el);

    expect(onclick).not.toHaveBeenCalled();
  });

  it("loading marks the button busy, disables it and blocks onclick", async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    const { container } = render(Button, {
      props: { children, onclick, loading: true },
    });

    const el = button(container);
    expect(el).toHaveClass("is-loading");
    expect(el).toHaveAttribute("aria-busy", "true");
    expect(el).toBeDisabled();
    await user.click(el);

    expect(onclick).not.toHaveBeenCalled();
  });

  it.each(["primary", "danger", "start"] as const)(
    "variant %s adds only its own modifier",
    (variant) => {
      const { container } = render(Button, { props: { children, variant } });

      const el = button(container);
      expect(el).toHaveClass("dex-btn", `dex-btn--${variant}`);
      for (const other of ["primary", "danger", "start"]) {
        if (other !== variant) {
          expect(el).not.toHaveClass(`dex-btn--${other}`);
        }
      }
    },
  );

  it("adds the sm and block modifiers when asked", () => {
    const small = render(Button, { props: { children, sm: true } });
    expect(button(small.container)).toHaveClass("dex-btn", "dex-btn--sm");
    expect(button(small.container)).not.toHaveClass("dex-btn--block");

    const wide = render(Button, { props: { children, block: true } });
    expect(button(wide.container)).toHaveClass("dex-btn", "dex-btn--block");
    expect(button(wide.container)).not.toHaveClass("dex-btn--sm");
  });

  it("reflects pressed as aria-pressed and omits it when undefined", () => {
    const on = render(Button, { props: { children, pressed: true } });
    expect(button(on.container)).toHaveAttribute("aria-pressed", "true");

    const off = render(Button, { props: { children, pressed: false } });
    expect(button(off.container)).toHaveAttribute("aria-pressed", "false");

    const plain = render(Button, { props: { children } });
    expect(button(plain.container)).not.toHaveAttribute("aria-pressed");
  });

  it("renders an anchor with the href and no type when href is given", () => {
    const { container } = render(Button, {
      props: { children, href: "/login", sm: true },
    });

    const el = button(container);
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "/login");
    expect(el).not.toHaveAttribute("type");
    expect(el).not.toHaveAttribute("disabled");
    expect(el).toHaveClass("dex-btn", "dex-btn--sm");
  });

  it("a disabled or loading link drops its href and is aria-disabled", () => {
    const off = render(Button, {
      props: { children, href: "/login", disabled: true },
    });
    const offEl = button(off.container);
    expect(offEl.tagName).toBe("A");
    expect(offEl).not.toHaveAttribute("href");
    expect(offEl).not.toHaveAttribute("disabled");
    expect(offEl).toHaveAttribute("aria-disabled", "true");

    const busy = render(Button, {
      props: { children, href: "/login", loading: true },
    });
    const busyEl = button(busy.container);
    expect(busyEl).not.toHaveAttribute("href");
    expect(busyEl).toHaveAttribute("aria-disabled", "true");
    expect(busyEl).toHaveAttribute("aria-busy", "true");
  });

  it("lets a caller override the default type", () => {
    const { container } = render(Button, {
      props: { children, type: "submit" },
    });

    expect(button(container)).toHaveAttribute("type", "submit");
  });

  it("does not let rest re-enable a loading button", () => {
    const { container } = render(Button, {
      props: { children, loading: true, disabled: false },
    });

    expect(button(container)).toBeDisabled();
  });

  it("is reachable by Tab and activates on Enter and Space", async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    const { container } = render(Button, { props: { children, onclick } });

    const el = button(container);
    await user.tab();
    expect(document.activeElement).toBe(el);

    await user.keyboard("{Enter}");
    expect(onclick).toHaveBeenCalledTimes(1);

    await user.keyboard("[Space]");
    expect(onclick).toHaveBeenCalledTimes(2);
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Button, {
      props: {
        children,
        id: "save",
        name: "intent",
        form: "login",
        "aria-label": "Save entry",
        class: "extra",
      },
    });

    const el = button(container);
    expect(el).toHaveAttribute("id", "save");
    expect(el).toHaveAttribute("name", "intent");
    expect(el).toHaveAttribute("form", "login");
    expect(el).toHaveAttribute("aria-label", "Save entry");
    expect(el).toHaveClass("dex-btn", "extra");
  });
});
