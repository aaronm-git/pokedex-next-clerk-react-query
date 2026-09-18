# Phase 2: component library and deck navigation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the finished design system into a Svelte 5 component library, build the six screens with static content, and make the Game Boy deck actually drive the app.

**Architecture:** The design system in `src/lib/styles/` stays a global BEM stylesheet and is never edited. Components are markup and behaviour that consume its classes; the common case has no `<style>` block at all. `docs/design/style-guide.html` is the reviewed markup reference: each component's structure is copied from it rather than invented. No Pokémon data is fetched; every screen renders fixtures. Data arrives in phase 3.

**Tech Stack:** SvelteKit 2.70, Svelte 5.57 runes, TypeScript, plain CSS, Vitest 5 with jsdom and `@testing-library/svelte`.

**Spec:** `docs/superpowers/specs/2026-09-18-sveltekit-rewrite-and-auth-design.md`

## Authority: what binds you, and what does not

**This plan is a suggestion, not a rule.** You have full autonomy over how the
work gets done. Every piece of code in it is one person's guess at a reasonable
shape, written before any of it existed. Where your model, your skills, or what
you find in the codebase points somewhere better, go there. Reject my approach
and say why; do not implement something you believe is wrong because a plan said
so.

Specifically, all of the following are advisory and you may override any of them:

- The file and directory layout
- Which components exist, how they are split, and what they are named
- Prop names, signatures and types, including ones this plan calls load-bearing
- Every code block, test and implementation shown here
- Task ordering and boundaries, and whether a task should be split or merged
- Testing strategy, and what is worth testing at all
- The parent's review checklist, if you have a better one

If a task turns out to be the wrong unit of work, restructure it. If a component
this plan invents should not exist, do not build it. If the Svelte skills
installed for this work recommend a pattern that contradicts something here, the
skills win: they encode how Svelte is actually written, and this plan encodes how
one Opus session guessed it might be.

**Report every override.** Not for permission, for the record. Say what you
rejected, what you did instead, and why. A plan that survives contact unchanged
usually means nobody was thinking.

### What is not advisory

A short list, and it does not come from this plan. It comes from the project
owner and the spec, and it is not yours to override. If you believe one of these
is wrong, stop and say so rather than working around it:

- **Plain CSS only.** No Tailwind, no CSS-in-JS, no utility framework, no
  component library. This was chosen deliberately, against the alternatives, by
  the owner.
- **Never modify, move or delete anything under `src/lib/styles/` or
  `docs/design/`.** Reviewed, signed-off design output.
- **Svelte 5 runes.** No `export let`, `createEventDispatcher` or `<slot>`.
- **pnpm.** Never npm.
- **No data fetching in this phase.** Fixtures only; data is phase 3.
- **WCAG AA**, keyboard operability, and `prefers-reduced-motion`.
- **No deploy automation.** The Netlify Free plan caps at 300 credits a month.

Everything else on this page is a suggestion.

## Global constraints

- **Plain CSS only.** No Tailwind, no CSS-in-JS, no utility framework, no component library.
- **Never modify, move or delete anything under `src/lib/styles/` or `docs/design/`.** Signed-off design output. If a needed style is missing, escalate; do not add it.
- **Scoped `<style>` blocks are for arrangement, never appearance.** A block may position or space things using `var(--token)` values only. A literal colour, `px`, `rem` or duration inside a component `<style>` is a defect. New visual treatments escalate.
- **Every class name must already exist** in `device.css`, `components.css` or `type.css`. An invented class is a silent no-op and is the single most likely failure in this phase. Grep before writing.
- Svelte 5 runes only: `$props()`, `$state()`, `$derived()`, `$effect()`, callback props, `Snippet` with `{@render}`. Never `export let`, `createEventDispatcher` or `<slot>`.
- Package manager is pnpm. Never npm.
- No data fetching. No `@tanstack/svelte-query`. No network calls. Fixtures only.
- WCAG AA. Every interactive element is reachable and operable by keyboard, and every control has an accessible name.
- Respect `prefers-reduced-motion`; the design system already defines the tokens for it.
- Commit messages end with:
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

## Markup source of truth

`docs/design/style-guide.html` renders every component in every state, with a section per component. Serve it over HTTP (`python3 -m http.server 8777`, then `/docs/design/style-guide.html`) because it pulls fonts from Google and sprites from PokeAPI; `file://` will not work.

For each component, find its `<h3>` section, copy the markup structure verbatim, and parameterise only what the props table says varies. Do not restructure, do not rename classes, do not "improve" the markup. If the guide and this plan disagree, the guide wins and you report the discrepancy.

Sections: Box, Header, Menu, Button, Field, Row and list, Sprite well, Stat bar, Tabs, Card, Notice and toast, Hints/key-value/rule, Empty and loading, Deck states, plus seven numbered screen mockups under `#screens`.

## File structure

```
src/lib/components/
  device/        GameBoy, Deck, deck.ts          (exists, phase 1)
  layout/        Stack, Cluster, Split, Grid, ScreenBody, Rule
  display/       Box, Header, Notice, Toast, Hints, Kv, Empty, Loading,
                 Skeleton, Sprite, Ball, TypeBadge, StatBar, Card
  input/         Button, Field, Menu, List, Row, Tabs
  nav/           navigation.svelte.ts, useDeckNavigation
src/lib/fixtures/ pokemon.ts                     static sample data
src/routes/       +page, login, app/{dashboard,search,pokemon/[id],favorites}
src/routes/styleguide/                           living style guide
```

One component per file, colocated `Name.svelte.test.ts` beside it.

## Execution model

The implementer for each task is a parent agent that fans work out to child
agents, one child per component or small group, then reviews every child's output
before reporting. Children inherit the same autonomy the parent has: a child that
thinks its brief is wrong should say so rather than building something it does
not believe in, and a parent that receives that pushback should weigh it rather
than overruling by default.

The parent's review exists to catch what autonomy cannot, namely the things that
are silently wrong rather than debatably wrong. It is not optional, and it must
check, for each child's files:

1. Every class used exists in the design system. `grep -o 'class="[^"]*"'` on the component, then confirm each token against `src/lib/styles/`.
2. No `<style>` block contains a literal colour, `px`, `rem`, `ms` or `s` value.
3. Svelte 5 idioms only; no `export let`, `createEventDispatcher` or `<slot>`.
4. The component's test asserts behaviour or rendered structure, not that a mock was called.
5. The markup matches the style guide section it came from.

A parent that reports DONE without having run those five checks has not finished
the task. Note that all five test the non-negotiable list above, not this plan's
suggestions. A child that restructured its component, renamed its props or threw
out the suggested test is not failing review for that; it is doing what it was
told it could do, and the parent records the override and moves on.

---

### Task 1: Layout and typography primitives

**Files:**
- Create: `src/lib/components/layout/{Stack,Cluster,Split,Grid,ScreenBody,Rule}.svelte` and one `.svelte.test.ts` each

**Interfaces:**
- Consumes: `dex-stack` (`--tight`), `dex-cluster`, `dex-split`, `dex-grid` (`--2`, `--3`), `dex-screen-body`, `dex-rule` (`--dashed`) from `components.css`
- Produces: the composition primitives every later task builds with. Their prop names are load-bearing for Tasks 2, 3, 5 and 6.

Every one of these takes a `children: Snippet` and renders a single element with the matching class. They exist so no other component writes a flexbox rule.

- [ ] **Step 1: Write the failing test for `Stack`**

`src/lib/components/layout/Stack.svelte.test.ts`:

```ts
import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import StackHarness from "./StackHarness.test.svelte";

describe("Stack", () => {
  it("renders its children inside a dex-stack", () => {
    const { container } = render(StackHarness, { props: { tight: false } });
    const el = container.querySelector(".dex-stack");
    expect(el).not.toBeNull();
    expect(el?.textContent).toContain("child content");
    expect(el?.classList.contains("dex-stack--tight")).toBe(false);
  });

  it("applies the tight modifier", () => {
    const { container } = render(StackHarness, { props: { tight: true } });
    expect(
      container.querySelector(".dex-stack")?.classList.contains("dex-stack--tight"),
    ).toBe(true);
  });
});
```

Snippet props cannot be passed from `render()` directly, so each test gets a harness component. `src/lib/components/layout/StackHarness.test.svelte`:

```svelte
<script lang="ts">
  import Stack from "./Stack.svelte";

  let { tight = false }: { tight?: boolean } = $props();
</script>

<Stack {tight}>child content</Stack>
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
pnpm test
```

Expected: FAIL, cannot resolve `./Stack.svelte`.

- [ ] **Step 3: Implement `Stack`**

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    tight = false,
    children,
  }: { tight?: boolean; children: Snippet } = $props();
</script>

<div class="dex-stack" class:dex-stack--tight={tight}>
  {@render children()}
</div>
```

`class:name={condition}` is Svelte's conditional class directive. It is the idiom to use for every modifier in this phase, rather than building class strings by hand.

- [ ] **Step 4: Run the test and confirm it passes**

```bash
pnpm test
```

Expected: PASS.

- [ ] **Step 5: Build the remaining five to the same shape**

Each is the same pattern: `children: Snippet`, one element, one base class, `class:` for modifiers. Each gets its own harness and test asserting the base class renders, children appear, and each modifier toggles.

| Component | Element | Base class | Props |
| --- | --- | --- | --- |
| `Cluster` | `div` | `dex-cluster` | `children` |
| `Split` | `div` | `dex-split` | `children` |
| `Grid` | `div` | `dex-grid` | `cols?: 2 \| 3` → `dex-grid--2` / `--3`, `children` |
| `ScreenBody` | `div` | `dex-screen-body` | `children` |
| `Rule` | `hr` | `dex-rule` | `dashed?: boolean` → `dex-rule--dashed` |

`Rule` takes no children.

- [ ] **Step 6: Gates and commit**

```bash
pnpm run lint && pnpm run check && pnpm test && pnpm run build
```

All four must exit 0.

```bash
git add -A
git commit -m "$(cat <<'MSG'
feat(layout): add the design system's composition primitives

Stack, Cluster, Split, Grid, ScreenBody and Rule wrap the layout classes
so no other component writes a flexbox rule.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 2: Presentational components

**Files:**
- Create: `src/lib/components/display/{Box,Header,Notice,Toast,Hints,Kv,Empty,Loading,Skeleton,Sprite,Ball,TypeBadge,StatBar,Card}.svelte`, a test beside each, and harnesses where a component takes a snippet

**Interfaces:**
- Consumes: Task 1's layout primitives; the `dex-*` classes named below
- Produces: the display vocabulary Tasks 5 and 6 compose. Prop names are load-bearing.

None of these hold state or emit events. They take data and render it.

- [ ] **Step 1: Write the failing test for `TypeBadge`**

Start here because it is the one with real logic and the one most likely to be got wrong. The design system styles 18 types through `[data-type]`, so the attribute must reach the DOM verbatim and lowercased.

`src/lib/components/display/TypeBadge.svelte.test.ts`:

```ts
import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import TypeBadge from "./TypeBadge.svelte";

describe("TypeBadge", () => {
  it("renders the type name and sets data-type for the stylesheet", () => {
    render(TypeBadge, { props: { type: "fire" } });
    const el = screen.getByText("fire");
    expect(el.classList.contains("dex-type")).toBe(true);
    expect(el.getAttribute("data-type")).toBe("fire");
  });

  it("lowercases the data-type so it matches the stylesheet selectors", () => {
    render(TypeBadge, { props: { type: "Water" } });
    expect(screen.getByText("Water").getAttribute("data-type")).toBe("water");
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
pnpm test
```

- [ ] **Step 3: Implement `TypeBadge`**

```svelte
<script lang="ts">
  let { type }: { type: string } = $props();

  const slug = $derived(type.toLowerCase());
</script>

<span class="dex-type" data-type={slug}>{type}</span>
```

`$derived` replaces React's `useMemo` and recomputes when `type` changes. No dependency array.

- [ ] **Step 4: Run the test and confirm it passes**

- [ ] **Step 5: Build the remaining thirteen**

Copy each one's markup from its `<h3>` section in the style guide. Props below; anything not listed does not vary.

| Component | Style guide section | Props |
| --- | --- | --- |
| `Box` | Box | `title?: string`, `thick?`, `single?`, `flush?`, `inverted?: boolean`, `children` |
| `Header` | Header | `title: string`, `meta?: { label: string; value: string }[]` |
| `Notice` | Notice and toast | `tone?: "ok" \| "warn" \| "error"`, `title?: string`, `children` |
| `Toast` | Notice and toast | `children` |
| `Hints` | Hints, key/value, rule | `hints: { key: string; label: string }[]` |
| `Kv` | Hints, key/value, rule | `rows: { label: string; value: string }[]` |
| `Empty` | Empty and loading | `children` |
| `Loading` | Empty and loading | `label?: string` |
| `Skeleton` | Empty and loading | `count?: number` |
| `Sprite` | Sprite well | `src: string`, `alt: string`, `lg?`, `inverted?: boolean` |
| `Ball` | Row and list | `filled?: boolean` |
| `StatBar` | Stat bar | `label: string`, `value: number`, `max?: number` (default 255) |
| `Card` | Card | `label: string`, `value: string`, `caption?: string`, `inverted?`, `href?: string` |

`StatBar` drives two things the stylesheet reads. The fill width comes from an
inline `style="--value:NN"` where `NN` is `value / max * 100`, and this is the one
place an inline style is correct, because it carries data rather than appearance.
The colour comes from `data-level`: omit the attribute for green, set `"mid"` for
yellow, set `"low"` for red. Thresholds are absolute base-stat values, not
percentages, because base stats rarely exceed 150 and a percentage of 255 would
paint almost everything red: `low` under 60, `mid` under 100, otherwise no
attribute.

`Card` renders an `<a class="dex-card dex-card--link">` when `href` is given and a `<div class="dex-card">` otherwise.

Every component gets a test asserting its base class, its content, and each modifier.

- [ ] **Step 6: Gates and commit**

```bash
pnpm run lint && pnpm run check && pnpm test && pnpm run build
```

```bash
git add -A
git commit -m "$(cat <<'MSG'
feat(display): add the presentational component vocabulary

Box, Header, Notice, Toast, Hints, Kv, Empty, Loading, Skeleton, Sprite,
Ball, TypeBadge, StatBar and Card, each consuming design system classes
with no styles of their own.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 3: Interactive components

**Files:**
- Create: `src/lib/components/input/{Button,Field,Menu,List,Row,Tabs}.svelte`, tests and harnesses beside each

**Interfaces:**
- Consumes: Task 1 and 2 components
- Produces: `Menu` and `List` expose the selection interface Task 4 drives. Their prop and callback names are load-bearing:
  - `Menu`: `items: MenuItem[]`, `activeIndex: number`, `onactivate?: (index: number) => void`
  - `List`: `rows: RowData[]`, `activeIndex: number`, `onactivate?: (index: number) => void`
  - Both accept `activeIndex` from the parent. Neither owns selection state; Task 4's navigation store does.

- [ ] **Step 1: Write the failing test for `Button`**

```ts
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ButtonHarness from "./ButtonHarness.test.svelte";

describe("Button", () => {
  it("calls onclick when pressed", async () => {
    const onclick = vi.fn();
    render(ButtonHarness, { props: { onclick, label: "Start" } });
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it("does not call onclick when disabled", async () => {
    const onclick = vi.fn();
    render(ButtonHarness, { props: { onclick, label: "Start", disabled: true } });
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(onclick).not.toHaveBeenCalled();
  });

  it("marks itself busy while loading", () => {
    render(ButtonHarness, { props: { label: "Start", loading: true } });
    const btn = screen.getByRole("button", { name: "Start" });
    expect(btn.classList.contains("is-loading")).toBe(true);
    expect(btn.getAttribute("aria-busy")).toBe("true");
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

- [ ] **Step 3: Implement `Button`**

Copy the markup from the style guide's Button section. Props: `variant?: "primary" | "danger" | "start"`, `sm?`, `block?`, `disabled?`, `loading?: boolean`, `onclick?: () => void`, `children`. A loading button sets `is-loading` and `aria-busy="true"` and is disabled.

- [ ] **Step 4: Run the test and confirm it passes**

- [ ] **Step 5: Build the remaining five**

| Component | Style guide section | Notes |
| --- | --- | --- |
| `Field` | Field | `label`, `value` (bindable), `type?`, `placeholder?`, `help?`, `error?`, `search?`. The label must be associated with the input by `id`, so `getByLabelText` finds it. An error sets `aria-invalid` and links the message with `aria-describedby`. |
| `Menu` | Menu | Renders `dex-menu__item` per item. The item at `activeIndex` gets `aria-current="true"`. Calls `onactivate(index)` on click. |
| `Row` | Row and list | One `dex-row`: number, ball, name, optional thumb, optional end slot. `unseen?` and `thumb?` modifiers. |
| `List` | Row and list | A `dex-list` of `Row`s. Marks `activeIndex` with `aria-current="true"` and calls `onactivate(index)` on click. |
| `Tabs` | Tabs | `tabs: string[]`, `activeIndex`, `onactivate`. Uses `role="tablist"` / `role="tab"` with `aria-selected`, and `aria-controls` pointing at the panel. |

Selection is a prop, never internal state. Task 4 owns it.

- [ ] **Step 6: Gates and commit**

```bash
pnpm run lint && pnpm run check && pnpm test && pnpm run build
```

```bash
git add -A
git commit -m "$(cat <<'MSG'
feat(input): add the interactive components

Button, Field, Menu, List, Row and Tabs. Selection is always a prop, so
the navigation layer owns it rather than each component.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 4: Deck and keyboard navigation

**Files:**
- Create: `src/lib/components/nav/navigation.svelte.ts`, `src/lib/components/nav/navigation.svelte.test.ts`
- Modify: `src/routes/+layout.svelte`, `src/lib/components/device/Deck.svelte`

**Interfaces:**
- Consumes: `DeckButton` and `DeckDirection` from `src/lib/components/device/deck.ts`
- Produces:
  - `createListNavigation(options: { length: () => number; onselect?: (i: number) => void; onback?: () => void })` returning `{ index: number, handle: (button: DeckButton) => void }` where `index` is reactive state
  - The root layout binding keyboard events to `DeckButton`s

This is the task that makes the device more than decoration. Getting it wrong is invisible in a screenshot and obvious to anyone who tries the app.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from "vitest";
import { createListNavigation } from "./navigation.svelte";

describe("createListNavigation", () => {
  it("moves down and up within bounds", () => {
    const nav = createListNavigation({ length: () => 3 });
    expect(nav.index).toBe(0);
    nav.handle("down");
    expect(nav.index).toBe(1);
    nav.handle("up");
    expect(nav.index).toBe(0);
    nav.handle("up");
    expect(nav.index).toBe(0);
  });

  it("stops at the last item", () => {
    const nav = createListNavigation({ length: () => 2 });
    nav.handle("down");
    nav.handle("down");
    expect(nav.index).toBe(1);
  });

  it("calls onselect with the current index when A is pressed", () => {
    const onselect = vi.fn();
    const nav = createListNavigation({ length: () => 3, onselect });
    nav.handle("down");
    nav.handle("a");
    expect(onselect).toHaveBeenCalledWith(1);
  });

  it("calls onback when B is pressed", () => {
    const onback = vi.fn();
    const nav = createListNavigation({ length: () => 3, onback });
    nav.handle("b");
    expect(onback).toHaveBeenCalledTimes(1);
  });

  it("clamps the index when the list shrinks", () => {
    let len = 5;
    const nav = createListNavigation({ length: () => len });
    nav.handle("down");
    nav.handle("down");
    expect(nav.index).toBe(2);
    len = 2;
    nav.handle("down");
    expect(nav.index).toBeLessThan(2);
  });
});
```

The file is named `navigation.svelte.ts`, not `navigation.ts`. Svelte 5 only compiles runes in files with the `.svelte.ts` extension. A plain `.ts` file will not make `$state` reactive.

Note the test imports from `./navigation.svelte` and is itself named `navigation.svelte.test.ts`, so it runs in the jsdom `client` project where the Svelte compiler is active.

- [ ] **Step 2: Run it and confirm it fails**

- [ ] **Step 3: Implement the navigation factory**

Use `$state` for the index. Clamp against `length()` on every move, so a list that shrinks cannot leave the cursor out of bounds. `up`/`down` move by one; `left`/`right` are reserved for paging and do nothing yet; `a` selects; `b` goes back; `start` and `select` are ignored here.

- [ ] **Step 4: Run the tests and confirm they pass**

- [ ] **Step 5: Bind the keyboard in the root layout**

Add a `<svelte:window onkeydown={...} />` handler mapping:

| Key | DeckButton |
| --- | --- |
| `ArrowUp` / `w` | `up` |
| `ArrowDown` / `s` | `down` |
| `ArrowLeft` / `a` | `left` |
| `ArrowRight` / `d` | `right` |
| `Enter` / `z` | `a` |
| `Escape` / `x` | `b` |
| `Enter` with Shift | `start` |

Two rules the handler must obey, both testable:

1. **Ignore keys while a text input has focus.** Check `event.target` against `HTMLInputElement` and `HTMLTextAreaElement` and return early. Otherwise typing an email address on the login screen navigates the menu.
2. **Only call `preventDefault` for keys actually handled.** Swallowing every keystroke breaks browser shortcuts and tab navigation.

Write a test for both before implementing.

- [ ] **Step 6: Show pressed state on the deck**

When a key fires, the matching deck button takes `is-pressed` briefly so the on-screen device responds to the keyboard. The class already exists in `device.css`. Respect `prefers-reduced-motion` by skipping the timed removal and clearing immediately.

- [ ] **Step 7: Verify by hand in a browser**

```bash
pnpm run dev --port 5173
```

Arrow keys move the menu cursor, Enter activates, Escape goes back, clicking the on-screen D-pad does the same thing, and typing in a text field does not move the cursor. Tab still reaches every control. Stop the server.

- [ ] **Step 8: Gates and commit**

```bash
pnpm run lint && pnpm run check && pnpm test && pnpm run build
```

```bash
git add -A
git commit -m "$(cat <<'MSG'
feat(nav): drive the app from the deck and the keyboard

A list navigation factory owns cursor state, the root layout maps keys
onto deck buttons, and the on-screen deck shows pressed state. Keys are
ignored while a text input has focus.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 5: The six screens

**Files:**
- Create: `src/lib/fixtures/pokemon.ts`, `src/routes/login/+page.svelte`, `src/routes/app/+layout.svelte`, `src/routes/app/dashboard/+page.svelte`, `src/routes/app/search/+page.svelte`, `src/routes/app/pokemon/[id]/+page.svelte`, `src/routes/app/favorites/+page.svelte`
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Consumes: every component from Tasks 1 to 4
- Produces: the routes phase 3 fills with real data and phase 4 puts behind auth

Each screen is built from components. A screen that reaches for a raw `dex-*` class instead of the component that wraps it is a defect, unless no component covers it, in which case report it.

- [ ] **Step 1: Write the fixtures**

`src/lib/fixtures/pokemon.ts` exports a typed handful of Kanto entries with id, name, types, sprite URL, height, weight, base stats and a flavour description. Twelve entries is enough to fill a list, a grid and an empty state. Sprite URLs point at the same PokeAPI raw GitHub host the style guide uses.

Export types alongside the data. Phase 3 replaces the data and keeps the shape.

- [ ] **Step 2: Build each screen against its style guide mockup**

| Route | Style guide section | Content |
| --- | --- | --- |
| `/` | 1. Landing | Sprite, title, description, "Try the demo" as `variant="start"`, a log-in link, hints. Keep `+page.ts`'s `prerender = true`. |
| `/login` | 2. Login, and the sent state | Email `Field`, submit `Button`, and a sent state telling the reader to check their spam folder. Toggle with `$state`; no network call. |
| `/app/dashboard` | 3. Dashboard | Header with seen/own counts, a `Grid` of `Card`s, a short `List`. |
| `/app/search` | 4. Browse and search | Search `Field` filtering the fixtures client-side, a `List` driven by `createListNavigation`. |
| `/app/pokemon/[id]` | 5. Detail | Inverted panel, `Sprite`, `TypeBadge`es, `StatBar`s, `Kv` for height and weight, description. Read the id from the route param and look it up in the fixtures; an unknown id renders `Empty`. |
| `/app/favorites` | 6. Favorites | A `List` of favourites, plus the empty state when there are none. Use `$state` so it can be emptied in the browser. |

`src/routes/app/+layout.svelte` holds whatever the four app screens share. It is also where phase 4 adds the session check, so keep it thin and obvious.

- [ ] **Step 3: One test per screen**

Each asserts the screen renders its key landmarks and that its one interaction works: the login form toggles to the sent state, search filters the list, an unknown id renders the empty state.

- [ ] **Step 4: Verify every screen in a browser at 380px and 1600px**

Compare against the style guide's seven mockups, including its phone-width section. Report anything that does not match.

- [ ] **Step 5: Gates and commit**

```bash
pnpm run lint && pnpm run check && pnpm test && pnpm run build
```

```bash
git add -A
git commit -m "$(cat <<'MSG'
feat(routes): build the six screens on fixtures

Landing, login with its sent state, dashboard, search, detail and
favorites, each composed from components and fed static fixtures. Phase 3
replaces the data and keeps the shape.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 6: Living style guide route

**Files:**
- Create: `src/routes/styleguide/+page.svelte`, `src/routes/styleguide/+page.ts`

**Interfaces:**
- Consumes: every component built in Tasks 1 to 3

`docs/design/style-guide.html` renders hand-written markup. Once components exist, that page can drift from the real thing without anyone noticing. This route renders the actual components, so it cannot.

- [ ] **Step 1: Build the route**

Every component in every state, grouped as the static guide groups them, with a heading per group. Set `prerender = true` in `+page.ts`; it is fully static.

- [ ] **Step 2: Compare it against the static guide side by side in a browser**

Any difference is either a component defect or a place the static guide is now stale. Report which, for each.

- [ ] **Step 3: Note, do not delete, the static guide**

Add a line at the top of `docs/design/README.md`'s file list pointing at `/styleguide` as the live reference. Do not edit or delete `style-guide.html` itself; it is signed-off design output and the record of what was approved.

If that edit to `README.md` conflicts with the never-touch-`docs/design/` rule, stop and ask rather than deciding alone.

- [ ] **Step 4: Gates and commit**

```bash
pnpm run lint && pnpm run check && pnpm test && pnpm run build
```

```bash
git add -A
git commit -m "$(cat <<'MSG'
feat(styleguide): render the design system from the real components

A prerendered /styleguide route showing every component in every state,
so the reference cannot drift from the implementation the way a static
HTML copy can.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Done when

- `pnpm run lint`, `pnpm run check`, `pnpm test` and `pnpm run build` all exit 0
- All six screens render and match their style guide mockups at 380px and 1600px
- Arrow keys and the on-screen deck both move the cursor, Enter selects, Escape goes back, and typing in a text field does not navigate
- Every interactive element is keyboard reachable with an accessible name
- No component contains a literal colour, `px`, `rem` or duration
- No file under `src/lib/styles/` or `docs/design/style-guide.html` was modified
- No network call anywhere; every screen runs on fixtures

## Not in this phase

Real Pokémon data and `@tanstack/svelte-query` (phase 3). Authentication, the database, the working demo login and rate limiting (phase 4). Connecting Netlify and deleting the Vercel project (phases 5 and 6). Persisting favourites, which the spec already defers.
