<script lang="ts">
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import Empty from "$lib/components/display/Empty.svelte";
import Header from "$lib/components/display/Header.svelte";
import Hints from "$lib/components/display/Hints.svelte";
import TypeBadge from "$lib/components/display/TypeBadge.svelte";
import Field from "$lib/components/input/Field.svelte";
import List, { type RowData } from "$lib/components/input/List.svelte";
import Tabs from "$lib/components/input/Tabs.svelte";
import ScreenBody from "$lib/components/layout/ScreenBody.svelte";
import Stack from "$lib/components/layout/Stack.svelte";
import { onDeck } from "$lib/components/nav/deck.svelte";
import { createListNavigation } from "$lib/components/nav/navigation.svelte";
import { findPokemon, POKEMON } from "$lib/fixtures/pokemon";
import { TRAINER } from "$lib/fixtures/trainer";
import { padNo } from "$lib/pokemon/format";

const TABS = ["All", "Owned", "Favorites"];

let query = $state("");
let tab = $state(0);

// Filtering is live on every keystroke, so the Go button has nothing to do
// beyond not reloading the page.
const needle = $derived(query.trim().toLowerCase());

const pool = $derived(
  tab === 1
    ? POKEMON.filter((p) => TRAINER.owned.includes(p.id))
    : tab === 2
      ? POKEMON.filter((p) => TRAINER.favorites.includes(p.id))
      : POKEMON,
);

// "25", "025" and "pika" all find Pikachu: a name substring, a padded
// number prefix, or the bare id.
const rows: (RowData & { href: string })[] = $derived(
  pool
    .filter(
      (p) =>
        needle === "" ||
        p.name.toLowerCase().includes(needle) ||
        padNo(p.id).startsWith(needle) ||
        String(p.id) === needle,
    )
    .map((p) => ({
      id: p.id,
      number: p.id,
      name: p.name,
      owned: TRAINER.owned.includes(p.id),
      unseen: !TRAINER.seen.includes(p.id),
      href: resolve("/app/pokemon/[id]", { id: String(p.id) }),
    })),
);

// B clears the query first (the mockup's "B Clear"); only an empty query
// leaves the screen. The footer says which one applies.
const nav = createListNavigation({
  length: () => rows.length,
  onselect: (i) => goto(rows[i].href),
  onback: () => {
    if (query !== "") query = "";
    else goto(resolve("/app/dashboard"));
  },
});
onDeck(nav.handle);

const hints = $derived([
  { key: "↑↓", label: "Move" },
  { key: "A", label: "Open" },
  { key: "B", label: query === "" ? "Back" : "Clear" },
]);
</script>

<ScreenBody>
  <Header
    title="Pokédex"
    meta={[
      { label: "Seen", value: padNo(TRAINER.seen.length) },
      { label: "Own", value: padNo(TRAINER.owned.length) },
    ]}
  />
  <Stack>
    <form onsubmit={(event) => event.preventDefault()}>
      <Field
        search
        hideLabel
        label="Search"
        placeholder="Name or number"
        bind:value={query}
      />
    </form>
    <Tabs tabs={TABS} activeIndex={tab} onactivate={(i) => (tab = i)} />
    {#if rows.length > 0}
      <List
        {rows}
        activeIndex={nav.index}
        onactivate={(i) => (nav.index = i)}
        oncursor={(i) => (nav.index = i)}
      >
        {#snippet end(row)}
          {#each findPokemon(Number(row.id))?.types ?? [] as type (type)}
            <TypeBadge {type} />
          {/each}
        {/snippet}
      </List>
    {:else}
      <Empty title="No match">
        <p>Try a name or a dex number.</p>
      </Empty>
    {/if}
    {#if needle !== ""}
      <p class="t-label-xs t-mid">
        {rows.length} of {pool.length} match "{query}"
      </p>
    {/if}
  </Stack>
  <Hints {hints} />
</ScreenBody>
