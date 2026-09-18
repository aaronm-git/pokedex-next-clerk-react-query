# SvelteKit rewrite and magic link auth

Date: 2026-09-18
Status: approved for planning

## Goal

Rewrite the Pokédex from Next.js 15 / React 19 to SvelteKit, replace Clerk
with Better Auth using email magic links, move hosting from Vercel to a free
personal Netlify account, and add the first real database the project has had.

The app is a portfolio piece for AI engineer and web engineer applications.
Hiring managers will visit it and create accounts. That shapes several
decisions below: deliverability of login email matters, a fresh account must
not land on an empty screen, and public endpoints need rate limiting because
the app is genuinely public.

## Decisions

**SvelteKit, not plain Vite plus Svelte.** Better Auth needs server routes and
Nodemailer needs a TCP socket, neither of which exists in a client-only SPA.
SvelteKit runs on Vite, so the requested tooling is unchanged.

**Svelte over React.** Aaron's call, made with the knowledge that React appears
in more job postings. Not revisited.

**Netlify Database for Postgres.** Neon provisioned through the Netlify
account, so no separate database signup. Postgres over MongoDB because Better
Auth's Postgres path is more mature and pgvector leaves room for an embeddings
search feature later.

**SQLite ruled out.** Netlify Functions have an ephemeral filesystem. Writes
would vanish between invocations and accounts would disappear between logins.

**Gmail SMTP, not Resend.** Aaron does not want more accounts. The tradeoff is
that free Gmail cannot DKIM-sign for aaronmolina.me, so mail from
hire@aaronmolina.me is unauthenticated for that domain and carries some junk
folder risk at strict receivers. Mitigation is UI copy telling people to check
spam. No DNS change can fix this, since the signing happens on Google's side.
If deliverability becomes a real problem, the open options are Resend with
domain verification or adding include:_spf.google.com to SPF as a partial
improvement.

## Dependency replacement

Everything React-specific comes out. So does the entire styling stack, because
the UI is being redesigned from scratch in plain CSS rather than ported.

| Removed | Replacement |
| --- | --- |
| next, react, react-dom | @sveltejs/kit 2.70, svelte 5.57, vite 8.3 |
| @radix-ui/* (26 packages), shadcn/ui | nothing, hand-written components |
| tailwindcss, @tailwindcss/postcss, tw-animate-css | plain CSS with custom properties |
| class-variance-authority, clsx, tailwind-merge | nothing, Svelte scoped styles |
| @clerk/nextjs | better-auth 1.7.5 |
| @tanstack/react-query and its two companions | @tanstack/svelte-query 6.2 |
| next-themes, lucide-react, react-icons | nothing, the design system supplies its own |
| sonner, vaul, cmdk, input-otp, react-day-picker | nothing, hand-written |
| embla-carousel-react, react-resizable-panels | nothing, hand-written if needed |
| react-hook-form, @hookform/resolvers | sveltekit-superforms 2.30 with zod |
| recharts, react-chartjs-2, chart.js | hand-drawn CSS stat bars |
| @uidotdev/usehooks | Svelte 5 runes, no package needed |

Kept: zod, graphql-request, date-fns, biome, graphql-codegen. The generated
GraphQL types in src/graphql carry over untouched.

Added: @sveltejs/adapter-netlify 6.0, pg 8.23, nodemailer 10.0.

The dependency count drops hard. A Game Boy Pokédex needs a device shell, a
screen, a d-pad, buttons, a list, a card, stat bars, a text field, a dialog and
a toast. Call it a dozen components, not the 68 that exist now.

## Architecture

### Routes

Next's app directory maps onto SvelteKit's src/routes. The marketing page
becomes the root route, /login gets a real form, and the authenticated section
lives under a (app) group with a +layout.server.ts that loads the session.
Route protection moves from Next middleware into that layout load function,
which is simpler than the Next arrangement because SvelteKit load functions run
on the server with database access. There is no edge runtime split to work
around.

### Auth

Better Auth's SvelteKit handler mounts at /api/auth via src/hooks.server.ts.
The magicLink plugin is the only sign-in method. Its sendMagicLink callback
receives a finished URL and hands it to the email module.

Better Auth's CLI generates and migrates its own schema, so the user, session,
account and verification tables are not hand written.

The browser client comes from better-auth/svelte with magicLinkClient()
registered, exposing signIn.magicLink({ email, callbackURL }).

### Email

One module wraps Nodemailer, reading SMTP_HOST, SMTP_PORT, SMTP_USER and
SMTP_PASS. Mailpit on localhost:1025 in development, smtp.gmail.com:465 with a
Gmail app password in production. Same code path, different env values, so
swapping providers later is configuration rather than a rewrite.

From is hire@aaronmolina.me, an alias already verified for send-as in Aaron's
personal Gmail.

The sent-confirmation screen tells people to check their spam folder.

### Visual design

The app looks and feels like a Pokédex on a Game Boy Color. Not a modern app
with a retro accent, the whole thing: device chrome, LCD panel, dot-matrix
type, buttons that depress.

A Fable subagent owns this and delivers research notes, a static style guide
page covering every component in every state, and production CSS under
src/lib/styles. The style guide gets reviewed before any of it becomes Svelte
components.

Plain CSS with custom properties. Svelte's scoped style blocks mean no
framework is needed. Press Start 2P and Jersey 15 Charted are already loaded
and stay unless the research argues otherwise.

The pixel grid is a hard constraint, so scaling on large modern screens is a
design problem that gets solved explicitly rather than left to the browser.

### Demo login

A visible button on the landing page signs into a seeded account in one click
with no email round trip. Implemented as a server action that validates a fixed
demo identifier and issues a session, so nothing about it is guessable from the
client.

This exists because a reviewer gives the app about ninety seconds. Making them
leave for their inbox and come back loses a real fraction of them. Magic link
stays as the genuine auth path.

### Rate limiting

Better Auth's built-in limiter, configured tightly on the sign-in endpoint,
keyed by IP and by target email. Without it the endpoint mails anyone who types
an address into it, which would burn the sending reputation and stop real links
from arriving.

### Instrumentation

The magic link path logs request-in timestamp, SMTP handshake duration, total
send duration and a cold-start flag. The point is to learn whether Netlify's 10
second function timeout on the Free plan is ever close, since a cold SMTP
handshake to Gmail is the slow part.

Function log retention on Free is 24 hours, so these get checked promptly or
not at all. If the numbers turn out to be interesting, they move into Postgres.
Credit burn is watched in the Netlify dashboard rather than from logs.

## Deployment

Netlify, connected to the GitHub repo, building from main. Aaron said master;
the repo's default branch is main and no rename is planned.

Branch deploys off. Deploy previews stay on, since they cost nothing on the
plan and never touch production.

The Free plan caps at 300 credits per month, hard. Production deploys cost 15
credits each, so roughly 20 deploys exhausts the month before the database
spends anything. Exceeding it pauses every project on the account. Development
should lean on previews rather than repeated pushes to production.

## Phases

Each phase gets its own implementation plan.

1. SvelteKit skeleton. Scaffold, biome, vitest, adapter-netlify, the GraphQL
   codegen setup, the design system wired into the root layout, and a working
   build. No features yet.
2. UI design and build. Not a port. The existing 68 shadcn components are
   discarded. A Fable subagent owns the visual design and delivers a
   researched design system in plain CSS, reviewed as a static style guide
   before anything is built in Svelte.
3. Feature port. Pokémon search, detail, dashboard and favorites, with
   @tanstack/svelte-query replacing the React Query setup.
4. Database and auth. Netlify Database, Better Auth, magic link, email, demo
   login, rate limiting, instrumentation.
5. Deploy and cut over. Netlify connected to GitHub, verified working in
   production.
6. Teardown. Only after phase 5 is verified, delegate to a Sonnet subagent:
   delete the Vercel project, and check Neon and MongoDB Atlas for stray
   databases, reporting rather than assuming any exist.

## Out of scope

Favorites still will not persist to the database. They live in a query cache
today and will after this. With auth and a database in place it becomes small,
but it is a separate change.

Renaming the repo off pokedex-next-clerk-mongodb, which will be wrong on both
counts. Worth doing, since the repo name is the first thing a reviewer reads.

Any AI feature. Embeddings search over Pokémon data would be the highest value
addition for an AI role and pgvector on Netlify Database supports it, but it is
not part of this work.

## Risks

A custom design system is more work than adopting one, and it is the place
this stalls if it stalls. The mitigation is that the style guide gets reviewed
and signed off as a static HTML page before any of it becomes Svelte
components, so a wrong direction is caught while it is still cheap.

Pixel fonts and small type are a real accessibility risk. The design brief
requires WCAG AA contrast and readable body copy, because a hiring manager
squinting at the portfolio is a failure regardless of how authentic it looks.

Gmail deliverability, discussed above, accepted knowingly.

The 300 credit ceiling is tight during active development. If projects start
pausing, this is why.

Svelte 5 runes are a different mental model from React hooks. The favorites
hook and the query persistence hook are the two places where a direct
translation will produce something subtly wrong.

## Verification

The repo has no test setup at all today. Vitest goes in during phase 1 and
covers what can break silently: the email module builds a correct magic link
URL, the app layout load redirects an unauthenticated request, the session read
returns the right user, and demo sign-in rejects anything but the demo
identifier.

The full magic link round trip gets checked by hand against Mailpit, then once
against a real inbox before cutting over.
