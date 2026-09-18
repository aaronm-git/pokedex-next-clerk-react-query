import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import Toast, { TOAST_DURATION_MS } from "./Toast.svelte";

const children = createRawSnippet(() => ({
  render: () => "Added Pikachu to favorites",
}));

describe("Toast", () => {
  it("renders a single status div with the base class around its children", () => {
    const { container } = render(Toast, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-toast");
    expect(el).toHaveAttribute("role", "status");
    expect(el).toHaveTextContent("Added Pikachu to favorites");
  });

  it("lets a caller override the role", () => {
    const { container } = render(Toast, {
      props: { children, role: "alert" },
    });

    expect(container.firstElementChild).toHaveAttribute("role", "alert");
  });

  describe("dismissal", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("asks to be dismissed once the default duration has passed, not before", () => {
      vi.useFakeTimers();
      const ondismiss = vi.fn();
      render(Toast, { props: { children, ondismiss } });

      vi.advanceTimersByTime(TOAST_DURATION_MS - 1);
      expect(ondismiss).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(ondismiss).toHaveBeenCalledTimes(1);
    });

    it("takes a caller's duration", () => {
      vi.useFakeTimers();
      const ondismiss = vi.fn();
      render(Toast, { props: { children, ondismiss, duration: 500 } });

      vi.advanceTimersByTime(499);
      expect(ondismiss).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(ondismiss).toHaveBeenCalledTimes(1);
    });

    it("cancels the dismiss when it unmounts first", () => {
      vi.useFakeTimers();
      const ondismiss = vi.fn();
      const { unmount } = render(Toast, { props: { children, ondismiss } });

      unmount();
      vi.advanceTimersByTime(TOAST_DURATION_MS * 2);
      expect(ondismiss).not.toHaveBeenCalled();
    });

    it("sets no timer without a handler", () => {
      vi.useFakeTimers();
      render(Toast, { props: { children } });
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Toast, {
      props: { children, id: "toast", "aria-label": "Saved", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "toast");
    expect(el).toHaveAttribute("aria-label", "Saved");
    expect(el).toHaveClass("dex-toast", "extra");
  });
});
