# Phase 1: SvelteKit skeleton implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Next.js application shell with a SvelteKit one that builds, tests, lints, deploys to Netlify, and renders the Game Boy device chrome, with no product features yet.

**Architecture:** The repo is restructured in place rather than rebuilt beside itself, because two build systems in one package.json is worse than a clean cut. The React tree is deleted in task 1 and lives on in git history. The design system CSS that already exists in `src/lib/styles` becomes the app's only styling, imported once from the root layout. The device chrome becomes the root layout itself, so every route renders inside the Game Boy screen.

**Tech Stack:** SvelteKit 2.70, Svelte 5.57, Vite 8.3, TypeScript 5, `@sveltejs/adapter-netlify` 6.0, Vitest 5.0 with jsdom 30 and `@testing-library/svelte` 5.4, Biome 2.2, GraphQL Code Generator 6.

**Spec:** `docs/superpowers/specs/2026-09-18-sveltekit-rewrite-and-auth-design.md`

## Global constraints

- Plain CSS only. No Tailwind, no CSS-in-JS, no utility framework, no component library. Styling comes from `src/lib/styles/` plus component-scoped `<style>` blocks.
- Package manager is pnpm. The repo migrated from npm in commit 5b8e2e1. Never run `npm install`.
- Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`), not Svelte 4 stores or `export let`.
- Nothing in `src/lib/styles/` or `docs/design/` may be edited in this phase. It is reviewed, signed-off design output.
- Every color, size and motion value comes from a custom property already defined in `src/lib/styles/tokens.css`. Do not introduce new hardcoded values.
- Deploys target a Netlify Free account capped at 300 credits per month. Do not add deploy automation that pushes to production on every commit.
- Commit messages end with:
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

## File structure

Created:

- `svelte.config.js` — SvelteKit config, Netlify adapter, path aliases
- `vite.config.ts` — Vite plugins and the Vitest project definitions
- `src/app.html` — the HTML shell SvelteKit injects into
- `src/app.d.ts` — SvelteKit ambient types
- `src/routes/+layout.svelte` — imports the design system, renders the device
- `src/routes/+page.svelte` — a placeholder landing route
- `src/lib/components/device/GameBoy.svelte` — shell, bezel, screen slot, deck
- `src/lib/components/device/Deck.svelte` — D-pad, A/B, Start/Select
- `src/lib/components/device/deck.ts` — the deck button type and event contract
- `src/lib/pokemon/client.ts` — the PokeAPI GraphQL fetch wrapper
- `netlify.toml` — build command, publish dir, Node version
- `vitest-setup.ts` — jest-dom matchers

Moved:

- `src/graphql/` → `src/lib/graphql/` (generated, untouched)
- `lib/pokemonClient.ts` → `src/lib/pokemon/client.ts`
- `lib/queries.ts` → `src/lib/pokemon/queries.ts`

Deleted:

- `app/`, `components/`, `hooks/`, `lib/`, `types/`, `.clerk/`
- `middleware.ts`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `components.json`

Modified:

- `package.json`, `tsconfig.json`, `biome.json`, `codegen.ts`, `.gitignore`

---

### Task 1: Strip Next.js and scaffold a building SvelteKit app

**Files:**
- Delete: `app/`, `components/`, `hooks/`, `lib/`, `types/`, `.clerk/`, `middleware.ts`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `components.json`
- Move: `src/graphql/` → `src/lib/graphql/`, `lib/pokemonClient.ts` → `src/lib/pokemon/client.ts`, `lib/queries.ts` → `src/lib/pokemon/queries.ts`
- Create: `svelte.config.js`, `vite.config.ts`, `src/app.html`, `src/app.d.ts`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`
- Modify: `package.json`, `tsconfig.json`, `.gitignore`

**Interfaces:**
- Consumes: nothing
- Produces: a `pnpm build` that exits 0, the `$lib` alias resolving to `src/lib`, and `src/lib/styles/index.css` importable

- [ ] **Step 1: Branch**

```bash
git checkout -b sveltekit-rewrite
```

- [ ] **Step 2: Move the files that survive, then delete the rest**

Do the moves before the deletes so nothing that is being kept is lost.

```bash
mkdir -p src/lib/pokemon
git mv src/graphql src/lib/graphql
git mv lib/pokemonClient.ts src/lib/pokemon/client.ts
git mv lib/queries.ts src/lib/pokemon/queries.ts
git rm -r --quiet app components hooks lib types
git rm --quiet middleware.ts next.config.ts next-env.d.ts postcss.config.mjs components.json
rm -rf .clerk .next
```

`lib/pokemonService.ts` and `lib/constants.ts` are deliberately not kept. `pokemonService` wrapped React Query and gets rewritten in phase 3. `constants.ts` held `POKEMON_TYPE_COLORS`, which the design system now owns as `dex-type[data-type]` in `src/lib/styles/components.css`.

- [ ] **Step 3: Replace package.json**

`graphql-request` and `date-fns` are dropped because nothing imports them, verified by grep.

```json
{
  "name": "pokedex",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "biome check",
    "format": "biome check --write",
    "codegen": "graphql-codegen --config codegen.ts"
  },
  "devDependencies": {
    "@biomejs/biome": "2.2.0",
    "@graphql-codegen/cli": "^6.0.0",
    "@graphql-codegen/schema-ast": "^5.0.0",
    "@sveltejs/adapter-netlify": "^6.0.4",
    "@sveltejs/kit": "^2.70.3",
    "@sveltejs/vite-plugin-svelte": "^7.3.0",
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/svelte": "^5.4.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^20",
    "jsdom": "^30.1.0",
    "svelte": "^5.57.0",
    "svelte-check": "^4.7.6",
    "typescript": "^5",
    "vite": "^8.3.0",
    "vitest": "^5.0.1"
  }
}
```

- [ ] **Step 4: Install**

```bash
rm -rf node_modules pnpm-lock.yaml && pnpm install
```

- [ ] **Step 5: Create `svelte.config.js`**

```js
import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $styles: "src/lib/styles",
    },
  },
};
```

- [ ] **Step 6: Create `vite.config.ts`**

```ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
});
```

- [ ] **Step 7: Create `src/app.html`**

`data-dot` is deliberately absent from `<html>`. `tokens.css` sets `--dot` from a media query by default and only honours a `data-dot` attribute as an override, which the SELECT button will toggle in a later phase.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon-32x32.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0B0C0E" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    %sveltekit.body%
  </body>
</html>
```

- [ ] **Step 8: Create `src/app.d.ts`**

```ts
declare global {
  namespace App {}
}

export {};
```

- [ ] **Step 9: Replace `tsconfig.json`**

The `next` TypeScript plugin is gone. `graphqlsp` stays, because the PokeAPI schema and typed documents survive.

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler",
    "plugins": [
      {
        "name": "@0no-co/graphqlsp",
        "schema": "./schema.graphql"
      }
    ]
  }
}
```

- [ ] **Step 10: Replace the Next.js entries in `.gitignore`**

Replace the `# next.js` block (the `/.next/` and `/out/` lines) with:

```
# sveltekit
/.svelte-kit/
/build/
/.netlify/
```

- [ ] **Step 11: Create a placeholder layout and route**

`src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import "$styles/index.css";

  let { children } = $props();
</script>

{@render children()}
```

`src/routes/+page.svelte`:

```svelte
<h1 class="t-display">Pokédex</h1>
```

- [ ] **Step 12: Verify the build**

```bash
pnpm run build
```

Expected: exits 0 and writes `.svelte-kit/output/`. If it fails on a missing `.svelte-kit/tsconfig.json`, run `pnpm exec svelte-kit sync` first and build again.

- [ ] **Step 13: Verify the dev server renders**

```bash
pnpm run dev --port 5173
```

Open `http://localhost:5173`. Expected: the word Pokédex in Press Start 2P on the dark stage background, proving `src/lib/styles/index.css` resolved through the `$styles` alias. Stop the server.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "$(cat <<'MSG'
feat(kit): replace the Next.js shell with SvelteKit

Delete the React tree, scaffold SvelteKit with the Netlify adapter, and
move the generated GraphQL client and queries under src/lib. No features
yet; this only has to build and render.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 2: Test and lint infrastructure

**Files:**
- Create: `vitest-setup.ts`, `src/lib/pokemon/client.test.ts`
- Modify: `vite.config.ts`, `biome.json`

**Interfaces:**
- Consumes: the `$lib` alias and `execute()` from `src/lib/pokemon/client.ts`
- Produces: `pnpm test` running both a node project and a jsdom project, so every later task has somewhere to put a test

- [ ] **Step 1: Write the failing test**

`execute()` already exists, moved in task 1. This test pins its contract before anything else depends on it. Create `src/lib/pokemon/client.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { execute } from "./client";

const ENDPOINT = "https://graphql.pokeapi.co/v1beta2";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("execute", () => {
  it("posts the query and variables to the PokeAPI endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { pokemon: [] } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    // biome-ignore lint/suspicious/noExplicitAny: the generated document type is not needed here
    await execute("query Q { pokemon { id } }" as any, { id: 25 } as any);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      query: "query Q { pokemon { id } }",
      variables: { id: 25 },
    });
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    // biome-ignore lint/suspicious/noExplicitAny: same
    await expect(execute("query Q { pokemon { id } }" as any)).rejects.toThrow(
      "Network response was not ok",
    );
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
pnpm test
```

Expected: FAIL. Vitest has no config yet, so it either finds no projects or cannot resolve the Svelte plugin.

- [ ] **Step 3: Create `vitest-setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add the Vitest projects to `vite.config.ts`**

Two projects, because component tests need a DOM and module tests are faster without one. The client project resolves the `browser` export condition so Svelte components load their client build.

```ts
import { svelteTesting } from "@testing-library/svelte/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    projects: [
      {
        extends: "./vite.config.ts",
        plugins: [svelteTesting()],
        test: {
          name: "client",
          environment: "jsdom",
          clearMocks: true,
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          setupFiles: ["./vitest-setup.ts"],
        },
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
        },
      },
    ],
  },
});
```

Component tests are named `*.svelte.test.ts` and land in the client project. Plain module tests are named `*.test.ts` and land in the server project.

- [ ] **Step 5: Run the tests to confirm they pass**

```bash
pnpm test
```

Expected: PASS, 2 tests in the `server` project, 0 in `client`.

- [ ] **Step 6: Update `biome.json` for Svelte**

Remove the `next` and `react` linter domains, which no longer apply, and replace the `.next` ignore with the SvelteKit build directories. Biome formats the `<script>` block of a `.svelte` file but not its markup or `<style>`, which is acceptable here because the CSS lives in `src/lib/styles`.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": [
      "**",
      "!node_modules",
      "!.svelte-kit",
      "!build",
      "!.netlify",
      "!src/lib/graphql/",
      "!src/lib/styles/",
      "!docs/design/"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noUnknownAtRules": "off"
      }
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

- [ ] **Step 7: Run lint and type check**

```bash
pnpm run lint && pnpm run check
```

Expected: both exit 0. Fix anything they report before committing.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "$(cat <<'MSG'
test(kit): add Vitest projects and point Biome at Svelte

Two Vitest projects: jsdom for component tests named *.svelte.test.ts,
node for plain module tests. First tests pin the PokeAPI fetch wrapper.
Biome drops the React and Next domains.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 3: The device shell as the root layout

**Files:**
- Create: `src/lib/components/device/deck.ts`, `src/lib/components/device/Deck.svelte`, `src/lib/components/device/GameBoy.svelte`, `src/lib/components/device/GameBoy.svelte.test.ts`
- Modify: `src/routes/+layout.svelte`, `src/routes/+page.svelte`

**Interfaces:**
- Consumes: `.gb-*` classes from `src/lib/styles/device.css`, `.dex-hints` and `.t-display` from `components.css` and `type.css`
- Produces:
  - `type DeckButton = "up" | "down" | "left" | "right" | "a" | "b" | "start" | "select"`
  - `GameBoy.svelte` with props `{ children: Snippet; onpress?: (button: DeckButton) => void }`
  - `Deck.svelte` with props `{ onpress?: (button: DeckButton) => void }`

Markup is copied from `docs/design/style-guide.html`, which is the reviewed reference. Do not invent class names; every class below already exists in `device.css`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/components/device/GameBoy.svelte.test.ts`:

```ts
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import GameBoy from "./GameBoy.svelte";

describe("GameBoy", () => {
  it("renders every deck button with an accessible name", async () => {
    render(GameBoy);

    for (const name of ["Up", "Down", "Left", "Right", "A", "B", "Start", "Select"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("reports which deck button was pressed", async () => {
    const onpress = vi.fn();
    render(GameBoy, { props: { onpress } });

    await userEvent.click(screen.getByRole("button", { name: "A" }));
    expect(onpress).toHaveBeenCalledWith("a");

    await userEvent.click(screen.getByRole("button", { name: "Up" }));
    expect(onpress).toHaveBeenCalledWith("up");
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
pnpm test
```

Expected: FAIL with a resolution error for `./GameBoy.svelte`.

- [ ] **Step 3: Create the deck contract**

`src/lib/components/device/deck.ts`:

```ts
export type DeckDirection = "up" | "down" | "left" | "right";

export type DeckButton = DeckDirection | "a" | "b" | "start" | "select";

export const DECK_DIRECTIONS: DeckDirection[] = ["up", "down", "left", "right"];
```

- [ ] **Step 4: Create `Deck.svelte`**

```svelte
<script lang="ts">
  import { DECK_DIRECTIONS, type DeckButton } from "./deck";

  let { onpress }: { onpress?: (button: DeckButton) => void } = $props();

  const label = (button: DeckButton) =>
    button.charAt(0).toUpperCase() + button.slice(1);
</script>

<div class="gb-deck">
  <div class="gb-dpad">
    {#each DECK_DIRECTIONS as dir (dir)}
      <button
        class="gb-dpad__btn"
        data-dir={dir}
        aria-label={label(dir)}
        onclick={() => onpress?.(dir)}
      ></button>
    {/each}
    <i class="gb-dpad__center"></i>
  </div>

  <div class="gb-ab">
    <div>
      <button
        class="gb-ab__btn gb-ab__btn--b"
        aria-label="B"
        onclick={() => onpress?.("b")}>B</button
      >
    </div>
    <div>
      <button class="gb-ab__btn" aria-label="A" onclick={() => onpress?.("a")}
        >A</button
      >
    </div>
  </div>

  <div class="gb-pills">
    <div class="gb-pill">
      <button
        class="gb-pill__btn"
        aria-label="Select"
        onclick={() => onpress?.("select")}
      ></button>
      <span class="gb-pill__label">Select</span>
    </div>
    <div class="gb-pill">
      <button
        class="gb-pill__btn"
        aria-label="Start"
        onclick={() => onpress?.("start")}
      ></button>
      <span class="gb-pill__label">Start</span>
    </div>
  </div>
</div>
```

`onpress` is a callback prop, which is how Svelte 5 replaces `createEventDispatcher`. If you are coming from React, it is the same idea as passing `onPress` down, and unlike Svelte 4 events it does not bubble.

- [ ] **Step 5: Create `GameBoy.svelte`**

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import Deck from "./Deck.svelte";
  import type { DeckButton } from "./deck";

  let {
    children,
    onpress,
  }: { children?: Snippet; onpress?: (button: DeckButton) => void } = $props();
</script>

<div class="gb-stage">
  <div class="gb-device">
    <div class="gb-device__top">
      <i class="gb-led is-on"></i><span class="gb-led-label">Power</span>
      <div class="gb-wordmark"><strong>Pokédex</strong></div>
    </div>

    <div class="gb-bezel">
      <div class="gb-screen">
        {@render children?.()}
      </div>
      <div class="gb-bezel__label">
        <span>Game</span>
        <span class="c1">D</span><span class="c2">E</span><span class="c3">X</span>
        <span class="c4">C</span><span class="c5">O</span><span class="c1">L</span
        ><span class="c2">O</span><span class="c3">R</span>
      </div>
    </div>

    <Deck {onpress} />

    <div class="gb-device__grille">
      <i></i><i></i><i></i><i></i><i></i><i></i>
    </div>
  </div>
</div>
```

`Snippet` is Svelte 5's replacement for slots. `{@render children?.()}` is the equivalent of React's `{children}`.

- [ ] **Step 6: Run the tests to confirm they pass**

```bash
pnpm test
```

Expected: PASS, 2 tests in `client`, 2 in `server`.

- [ ] **Step 7: Put the device in the root layout**

`src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import GameBoy from "$lib/components/device/GameBoy.svelte";
  import "$styles/index.css";

  let { children } = $props();
</script>

<GameBoy>
  {@render children()}
</GameBoy>
```

`src/routes/+page.svelte`:

```svelte
<div class="dex-screen-body">
  <h1 class="t-display">Pokédex</h1>
  <footer class="dex-hints">
    <span><kbd>A</kbd>Select</span>
    <span><kbd>B</kbd>Back</span>
    <span><kbd>Start</kbd>Menu</span>
  </footer>
</div>
```

- [ ] **Step 8: Check it against the style guide by eye**

```bash
pnpm run dev --port 5173
```

Open `http://localhost:5173` beside `docs/design/style-guide.html#device`, served with `python3 -m http.server 8777`. The shell, bezel, wordmark, deck and grille should match. Check 380px and 1600px widths. Stop both servers.

- [ ] **Step 9: Lint, type check, build**

```bash
pnpm run lint && pnpm run check && pnpm run build
```

Expected: all three exit 0.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "$(cat <<'MSG'
feat(device): render the Game Boy shell as the root layout

Every route now renders inside the LCD. The deck buttons are real
buttons reporting presses through an onpress callback prop; nothing
binds them to navigation yet.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 4: GraphQL codegen against the new paths

**Files:**
- Modify: `codegen.ts`, `src/lib/pokemon/queries.ts`

**Interfaces:**
- Consumes: `graphql()` from `src/lib/graphql`
- Produces: `pnpm run codegen` regenerating `src/lib/graphql/` without moving it back to `src/graphql/`

The generated client and the 52,547 line `schema.graphql` both survive the rewrite untouched. Only the paths in the config and the import specifier in `queries.ts` change.

- [ ] **Step 1: Point `codegen.ts` at the new locations**

```ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://graphql.pokeapi.co/v1beta2",
  documents: ["src/**/*.ts", "src/**/*.svelte"],
  ignoreNoDocuments: true,
  generates: {
    "./src/lib/graphql/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
```

- [ ] **Step 2: Fix the import in `queries.ts`**

The first line currently reads `import { graphql } from "@/src/graphql";`. The `@/*` path alias is gone with Next.js. Replace it with:

```ts
import { graphql } from "$lib/graphql";
```

- [ ] **Step 3: Run codegen**

```bash
pnpm run codegen
```

Expected: exits 0 and rewrites files under `src/lib/graphql/`. Confirm nothing reappeared at `src/graphql/`:

```bash
test ! -d src/graphql && echo "clean"
```

- [ ] **Step 4: Confirm the generated output still type checks**

```bash
pnpm run check
```

Expected: exits 0.

- [ ] **Step 5: Confirm the tests still pass**

```bash
pnpm test
```

Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'MSG'
build(codegen): point GraphQL codegen at src/lib

Documents are scanned from .ts and .svelte under src, output lands in
src/lib/graphql, and queries.ts imports through the $lib alias now that
the Next.js @/* alias is gone.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 5: Netlify build configuration

**Files:**
- Create: `netlify.toml`
- Modify: none

**Interfaces:**
- Consumes: the `@sveltejs/adapter-netlify` output configured in task 1
- Produces: a repo Netlify can build without dashboard configuration

Connecting the repo in the Netlify UI and tearing down Vercel are phase 5, not here. This task only makes the repo buildable.

- [ ] **Step 1: Create `netlify.toml`**

`adapter-netlify` writes the function bundle itself, so no functions directory is declared. The publish directory is `build`, which is the adapter's default output.

```toml
[build]
  command = "pnpm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "22"
  PNPM_VERSION = "10"
```

- [ ] **Step 2: Verify a production build produces the adapter output**

```bash
pnpm run build
```

Expected: exits 0, and both of these exist:

```bash
test -d build && echo "publish dir ok"
test -d .netlify/functions-internal && echo "server function ok"
```

If `.netlify/functions-internal` is missing, the adapter did not run, which means `svelte.config.js` is still on the default adapter. Re-check task 1 step 5.

- [ ] **Step 3: Verify the built app serves**

```bash
pnpm run preview --port 4173
```

Open `http://localhost:4173`. Expected: the device shell renders exactly as it does in dev. Stop the server.

- [ ] **Step 4: Full gate**

```bash
pnpm run lint && pnpm run check && pnpm test && pnpm run build
```

Expected: all four exit 0. This is the gate every later phase inherits.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'MSG'
build(netlify): add netlify.toml for the SvelteKit build

Pins Node 22 and pnpm 10, publishes the adapter's build directory. The
repo is not connected to Netlify yet; that is phase 5.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Done when

- `pnpm run lint`, `pnpm run check`, `pnpm test` and `pnpm run build` all exit 0
- `http://localhost:5173` renders the Game Boy shell, matching `docs/design/style-guide.html#device` at 380px and 1600px
- No file under `src/lib/styles/` or `docs/design/` was modified
- No React, Next.js, Tailwind or Radix package remains in `package.json`

## Not in this phase

Routes beyond the placeholder landing page, any Pokémon data on screen, keyboard and deck navigation bindings, authentication, the database, and connecting the repo to Netlify. Those are phases 2 through 5 in the spec.
