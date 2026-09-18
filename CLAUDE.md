# Pokédex project instructions

A Pokédex styled as a Game Boy Color, being rewritten from Next.js to SvelteKit in phases. It is a portfolio piece, so hiring managers will read this repo. These rules bind every change, whoever or whatever makes it.

## Styling

Plain CSS only. No Tailwind, no CSS-in-JS, no utility framework, no component library. The design system is the CSS in `src/lib/styles/`; use its tokens and classes rather than inventing new ones.

## Package manager

pnpm only. Never run `npm install` or `npm run`. `package.json` pins the pnpm version through `packageManager`, and `netlify.toml` pins the same major for the build.

## Svelte

Svelte 5 runes only: `$props()`, `$state()`, `$derived()`, `$effect()`. Never use `export let`, `createEventDispatcher` or `<slot>`. Children are snippets rendered with `{@render children()}`; events are callback props.

## Plans are suggestions

An implementation plan in `docs/superpowers/plans/` is one session's guess at a
reasonable shape, written before the code existed. You have full autonomy over
how work gets done: reject an approach you think is wrong, restructure a task
that is the wrong unit of work, and follow your skills over a plan's code when
they disagree. Report what you overrode and why, for the record rather than for
permission.

The rules in this file are different. They came from the project owner, not from
a plan, and they are not yours to override. If you think one is wrong, say so
rather than working around it.

## This is a rewrite, not a port

Nothing carries over because it happens to still work. Code written for the
Next.js app is legacy even when it compiles, and "it still type checks" is not a
reason to keep it. `src/lib/pokemon/queries.ts` is the last file in this
category: written in October 2025, against an older PokeAPI schema, for a React
Query service layer that no longer exists. Rewrite it against the current schema
and SvelteKit's load functions rather than porting it.

## GraphQL schema

`codegen` reads the vendored `schema.graphql` on disk, never the network, so
generated types are reproducible from committed source alone. To take upstream
changes run `pnpm run codegen:schema`, review that diff as its own commit, then
run `pnpm run codegen`. Never point generation back at the live endpoint.

## Files you must not touch

Nothing under `src/lib/styles/` or `docs/design/` may be modified, moved or deleted. That is signed-off design output and belongs to the design owner. If something there looks wrong, report it instead of fixing it.

## Netlify budget

The Netlify Free plan caps at 300 credits a month and a production deploy costs 15. Do not add deploy automation of any kind: no GitHub Actions workflow, no build hooks, no auto-deploy on push. Deploys are done by hand.
