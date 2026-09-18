<script lang="ts">
import { tick } from "svelte";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import Empty from "$lib/components/display/Empty.svelte";
import Header from "$lib/components/display/Header.svelte";
import Hints from "$lib/components/display/Hints.svelte";
import Toast from "$lib/components/display/Toast.svelte";
import Button from "$lib/components/input/Button.svelte";
import ButtonGroup from "$lib/components/input/ButtonGroup.svelte";
import List, { type RowData } from "$lib/components/input/List.svelte";
import ScreenBody from "$lib/components/layout/ScreenBody.svelte";
import Stack from "$lib/components/layout/Stack.svelte";
import { onDeck } from "$lib/components/nav/deck.svelte";
import { createListNavigation } from "$lib/components/nav/navigation.svelte";
import { findPokemon } from "$lib/fixtures/pokemon";
import { TRAINER } from "$lib/fixtures/trainer";

const searchHref = resolve("/app/search");
const browseId = "favorites-browse";

// Saved order, local to the page until phase 4 wires the database.
let favorites = $state([...TRAINER.favorites]);
let removed = $state<string | undefined>();

const rows = $derived(
  favorites.flatMap((id): RowData[] => {
    const pokemon = findPokemon(id);
    if (!pokemon) return [];
    return [
      {
        id,
        number: id,
        name: pokemon.name,
        thumb: pokemon.sprite,
        href: resolve("/app/pokemon/[id]", { id: String(id) }),
      },
    ];
  }),
);
const nav = createListNavigation({
  length: () => rows.length,
  // Spelled out rather than read from rows[i].href so the autofixer can see
  // the resolve(); it is the same route the row links to.
  onselect: (i) =>
    goto(resolve("/app/pokemon/[id]", { id: String(rows[i].id) })),
  onback: () => goto(resolve("/app/dashboard")),
});
const current = $derived(rows[nav.index]);
onDeck((button) =>
  button === "select" ? remove(nav.index) : nav.handle(button),
);

// The row under the cursor goes; the cursor clamps itself, so removing the
// last row leaves it on the new last row. Once the list is empty the Remove
// button is gone too, so focus moves to the one control that remains.
async function remove(index: number) {
  const row = rows[index];
  if (!row) return;
  favorites = favorites.filter((id) => id !== row.id);
  removed = row.name;
  if (favorites.length === 0) {
    await tick();
    document.getElementById(browseId)?.focus();
  }
}
</script>

<ScreenBody>
  <Header
    title="Favorites"
    meta={
      rows.length > 0
        ? [{ value: String(rows.length), label: "saved", valueFirst: true }]
        : []
    }
  />
  <Stack>
    {#if rows.length > 0}
      <List
        {rows}
        activeIndex={nav.index}
        onactivate={(i) => (nav.index = i)}
        oncursor={(i) => (nav.index = i)}
      />
      <ButtonGroup>
        <Button variant="danger" sm onclick={() => remove(nav.index)}>
          Remove {current?.name}
        </Button>
      </ButtonGroup>
    {:else}
      <Empty title="No favorites yet">
        <p>Open a Pokémon and press A to save it here.</p>
        <Button sm id={browseId} href={searchHref}>Browse Pokédex</Button>
      </Empty>
    {/if}
  </Stack>
  <Hints
    hints={
      rows.length > 0
        ? [
            { key: "A", label: "Open" },
            { key: "Select", label: "Remove" },
            { key: "B", label: "Back" },
          ]
        : [{ key: "B", label: "Back" }]
    }
  />
  <!-- Last in the body so it sits on the LCD's bottom edge, below the hints,
       where the mockup puts it. It is sticky, so it stays there as the list
       scrolls. Keyed on the name so a second removal remounts it: the slide
       replays and the dismiss timer starts over. -->
  {#if removed}
    {#key removed}
      <Toast ondismiss={() => (removed = undefined)}>Removed {removed}</Toast>
    {/key}
  {/if}
</ScreenBody>
