<script lang="ts">
import { SvelteSet } from "svelte/reactivity";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import Ball from "$lib/components/display/Ball.svelte";
import Bars from "$lib/components/display/Bars.svelte";
import Empty from "$lib/components/display/Empty.svelte";
import Header from "$lib/components/display/Header.svelte";
import Hints from "$lib/components/display/Hints.svelte";
import Kv from "$lib/components/display/Kv.svelte";
import Sprite from "$lib/components/display/Sprite.svelte";
import StatBar from "$lib/components/display/StatBar.svelte";
import TypeBadge from "$lib/components/display/TypeBadge.svelte";
import Types from "$lib/components/display/Types.svelte";
import Button from "$lib/components/input/Button.svelte";
import ButtonGroup from "$lib/components/input/ButtonGroup.svelte";
import List, { type RowData } from "$lib/components/input/List.svelte";
import Tabs from "$lib/components/input/Tabs.svelte";
import Rule from "$lib/components/layout/Rule.svelte";
import ScreenBody from "$lib/components/layout/ScreenBody.svelte";
import Split from "$lib/components/layout/Split.svelte";
import Stack from "$lib/components/layout/Stack.svelte";
import { onDeck } from "$lib/components/nav/deck.svelte";
import { findPokemon, POKEMON, type Pokemon } from "$lib/fixtures/pokemon";
import { TRAINER } from "$lib/fixtures/trainer";
import { formatHeight, formatWeight, padNo } from "$lib/pokemon/format";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();

const searchHref = resolve("/app/search");

function detailHref(id: number) {
  return resolve("/app/pokemon/[id]", { id: String(id) });
}

// Moving from one id to the next reuses this component and swaps `data`, so
// the favourites live in a set keyed by id rather than a boolean seeded once
// at init. Nothing persists beyond the page; the spec defers that.
const favorites = new SvelteSet(TRAINER.favorites);
const favorite = $derived(
  data.pokemon !== null && favorites.has(data.pokemon.id),
);

function toggleFavorite() {
  if (data.pokemon === null) return;
  if (favorites.has(data.pokemon.id)) favorites.delete(data.pokemon.id);
  else favorites.add(data.pokemon.id);
}

// Prev and next follow the fixture order, not id arithmetic, so 9 leads to
// 25 and not to a hole in the dex.
const position = $derived(POKEMON.findIndex((p) => p.id === data.id));
const prev = $derived<Pokemon | undefined>(
  position > 0 ? POKEMON[position - 1] : undefined,
);
const next = $derived<Pokemon | undefined>(
  position >= 0 ? POKEMON[position + 1] : undefined,
);

let tab = $state(0);

const stats = $derived(
  data.pokemon
    ? [
        { label: "HP", name: "HP", value: data.pokemon.stats.hp },
        { label: "Atk", name: "Attack", value: data.pokemon.stats.attack },
        { label: "Def", name: "Defense", value: data.pokemon.stats.defense },
        {
          label: "SpA",
          name: "Special Attack",
          value: data.pokemon.stats.specialAttack,
        },
        {
          label: "SpD",
          name: "Special Defense",
          value: data.pokemon.stats.specialDefense,
        },
        { label: "Spd", name: "Speed", value: data.pokemon.stats.speed },
      ]
    : [],
);

const evolutionRows = $derived<RowData[]>(
  (data.pokemon?.evolution ?? []).flatMap((id) => {
    const p = findPokemon(id);
    if (!p) return [];
    return [
      {
        id,
        number: id,
        name: p.name,
        owned: TRAINER.owned.includes(id),
        href: detailHref(id),
      },
    ];
  }),
);

// No list cursor here: the deck's left and right page through the dex and A
// is the Favorite button. The Tabs component keeps its own arrows while a
// tab has focus, so they never reach this handler in that case.
onDeck((button) => {
  switch (button) {
    case "a":
      toggleFavorite();
      break;
    case "b":
      goto(searchHref);
      break;
    case "left":
      if (prev) goto(resolve("/app/pokemon/[id]", { id: String(prev.id) }));
      break;
    case "right":
      if (next) goto(resolve("/app/pokemon/[id]", { id: String(next.id) }));
      break;
  }
});
</script>

<ScreenBody>
  {#if data.pokemon === null}
    <Header title="Pokédex" />
    <Empty title="No entry {padNo(data.id)}">
      <p>There is no Pokémon with that number in the Kanto dex.</p>
      <Button sm href={searchHref}>Browse Pokédex</Button>
    </Empty>
    <Hints hints={[{ key: "B", label: "Back" }]} />
  {:else}
    {@const pokemon = data.pokemon}
    <Header
      title={pokemon.name}
      meta={[{ label: "No.", value: padNo(pokemon.id) }]}
    />
    <Stack>
      <Split>
        <Sprite inverted src={pokemon.sprite} alt={pokemon.name} />
        <Stack tight style="flex:1">
          <div class="t-display">No.{padNo(pokemon.id)}</div>
          <p class="t-label">{pokemon.species}</p>
          <Types>
            {#each pokemon.types as type (type)}
              <TypeBadge {type} />
            {/each}
          </Types>
          <Kv
            rows={[
              { label: "HT", value: formatHeight(pokemon.height) },
              { label: "WT", value: formatWeight(pokemon.weight) },
            ]}
          />
        </Stack>
      </Split>
      <Rule />
      <p class="t-body">{pokemon.description}</p>
      <Tabs
        tabs={["Stats", "Moves", "Evolution"]}
        activeIndex={tab}
        onactivate={(i) => (tab = i)}
      >
        {#snippet panel(index)}
          {#if index === 0}
            <Bars>
              {#each stats as stat (stat.label)}
                <StatBar label={stat.label} name={stat.name} value={stat.value} />
              {/each}
            </Bars>
          {:else if index === 1}
            <ul class="t-body">
              {#each pokemon.moves as move (move)}
                <li>{move}</li>
              {/each}
            </ul>
          {:else}
            <List aria-label="Evolution" rows={evolutionRows} activeIndex={-1} />
          {/if}
        {/snippet}
      </Tabs>
      <ButtonGroup>
        <Button variant="primary" pressed={favorite} onclick={toggleFavorite}>
          <Ball filled={favorite} /> Favorite
        </Button>
        {#if next}
          <Button href={detailHref(next.id)}>Next: {next.name}</Button>
        {/if}
      </ButtonGroup>
    </Stack>
    <Hints
      hints={[
        { key: "A", label: "Favorite" },
        { key: "B", label: "Back" },
        { key: "←→", label: "Prev / next" },
      ]}
    />
  {/if}
</ScreenBody>
