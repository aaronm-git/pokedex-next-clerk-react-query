# Pokédex project instructions

A Pokédex styled as a Game Boy Color, being rewritten from Next.js to SvelteKit in phases. It is a portfolio piece, so hiring managers will read this repo. These rules bind every change, whoever or whatever makes it.

## Styling

Plain CSS only. No Tailwind, no CSS-in-JS, no utility framework, no component library. The design system is the CSS in `src/lib/styles/`; use its tokens and classes rather than inventing new ones.

## Package manager

pnpm only. Never run `npm install` or `npm run`. `package.json` pins the pnpm version through `packageManager`, and `netlify.toml` pins the same major for the build.

## Svelte

Svelte 5 runes only: `$props()`, `$state()`, `$derived()`, `$effect()`. Never use `export let`, `createEventDispatcher` or `<slot>`. Children are snippets rendered with `{@render children()}`; events are callback props.

## Files you must not touch

Nothing under `src/lib/styles/` or `docs/design/` may be modified, moved or deleted. That is signed-off design output and belongs to the design owner. If something there looks wrong, report it instead of fixing it.

## Netlify budget

The Netlify Free plan caps at 300 credits a month and a production deploy costs 15. Do not add deploy automation of any kind: no GitHub Actions workflow, no build hooks, no auto-deploy on push. Deploys are done by hand.
