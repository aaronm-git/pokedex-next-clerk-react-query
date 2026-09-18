import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Notice from "./Notice.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Try again.</span>",
}));

describe("Notice", () => {
  it("renders a status div with the body in a p and no tone by default", () => {
    const { container } = render(Notice, { props: { children } });

    expect(container.children).toHaveLength(1);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("dex-notice");
    expect(el).not.toHaveClass("dex-notice--ok");
    expect(el).not.toHaveClass("dex-notice--warn");
    expect(el).not.toHaveClass("dex-notice--error");
    expect(el).toHaveAttribute("role", "status");
    expect(el.querySelector(".dex-notice__title")).toBeNull();
    const body = el.querySelector("p") as HTMLElement;
    expect(body).toHaveTextContent("Try again.");
  });

  it("renders the title span before the body when given", () => {
    const { container } = render(Notice, {
      props: { children, title: "Sent" },
    });

    const el = container.firstElementChild as HTMLElement;
    const title = el.firstElementChild as HTMLElement;
    expect(title.tagName).toBe("SPAN");
    expect(title).toHaveClass("dex-notice__title");
    expect(title).toHaveTextContent("Sent");
    expect(title.nextElementSibling?.tagName).toBe("P");
  });

  it("adds the ok and warn modifiers with role status", () => {
    const ok = render(Notice, { props: { children, tone: "ok" } });
    expect(ok.container.firstElementChild).toHaveClass(
      "dex-notice",
      "dex-notice--ok",
    );
    expect(ok.container.firstElementChild).toHaveAttribute("role", "status");

    const warn = render(Notice, { props: { children, tone: "warn" } });
    expect(warn.container.firstElementChild).toHaveClass("dex-notice--warn");
    expect(warn.container.firstElementChild).toHaveAttribute("role", "status");
  });

  it("uses role alert for the error tone", () => {
    const { container } = render(Notice, {
      props: { children, tone: "error" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass("dex-notice", "dex-notice--error");
    expect(el).toHaveAttribute("role", "alert");
  });

  it("lets a caller override the role", () => {
    const { container } = render(Notice, {
      props: { children, tone: "error", role: "note" },
    });

    expect(container.firstElementChild).toHaveAttribute("role", "note");
  });

  it("passes rest attributes and extra classes through", () => {
    const { container } = render(Notice, {
      props: { children, id: "hint", "aria-label": "Hint", class: "extra" },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("id", "hint");
    expect(el).toHaveAttribute("aria-label", "Hint");
    expect(el).toHaveClass("dex-notice", "extra");
  });
});
