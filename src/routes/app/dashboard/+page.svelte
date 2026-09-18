<script lang="ts">
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import Card from "$lib/components/display/Card.svelte";
import Header from "$lib/components/display/Header.svelte";
import Hints from "$lib/components/display/Hints.svelte";
import Menu, { type MenuItem } from "$lib/components/input/Menu.svelte";
import Grid from "$lib/components/layout/Grid.svelte";
import ScreenBody from "$lib/components/layout/ScreenBody.svelte";
import Stack from "$lib/components/layout/Stack.svelte";
import { onDeck } from "$lib/components/nav/deck.svelte";
import { createListNavigation } from "$lib/components/nav/navigation.svelte";
import { findPokemon, KANTO_COUNT } from "$lib/fixtures/pokemon";
import { TRAINER } from "$lib/fixtures/trainer";
import { padNo } from "$lib/pokemon/format";

const searchHref = resolve("/app/search");
const favoritesHref = resolve("/app/favorites");

const seen = TRAINER.seen.length;
const seenCaption =
  seen === KANTO_COUNT ? "Kanto complete" : `${KANTO_COUNT - seen} to go`;

// Favorites are stored in the order they were saved, so the last id is the
// newest. The mockup's "3 added this week" has no date behind it.
const favorites = TRAINER.favorites.length;
const newestFavorite = findPokemon(TRAINER.favorites.at(-1) ?? 0);
const favoritesCaption = newestFavorite
  ? `Latest: ${newestFavorite.name}`
  : undefined;

const lastViewed = findPokemon(TRAINER.lastViewed);

// Every item carries an href so A and a click land on the same URL.
const items: (MenuItem & { href: string })[] = [
  { id: "browse", label: "Browse Pokédex", href: searchHref },
  {
    id: "favorites",
    label: "Favorites",
    href: favoritesHref,
    hint: String(favorites),
  },
  // Phase 4 wires the real sign-out; until then the link just leaves /app.
  { id: "logout", label: "Log out", href: resolve("/") },
];

// The dashboard is the root of the signed-in app: B has nowhere to go back
// to, so there is no onback. The item hrefs are resolved where the items are
// built, so goto gets a resolved path; the svelte-autofixer cannot see
// through the property access and flags this goto as "without resolve()".
const nav = createListNavigation({
  length: () => items.length,
  onselect: (i) => goto(items[i].href),
});
onDeck(nav.handle);
</script>

<ScreenBody>
  <Header title="Trainer" meta={[{ label: TRAINER.email }]} />
  <Stack>
    <Grid cols={3}>
      <Card
        label="Seen"
        value={String(seen)}
        caption={seenCaption}
        href={searchHref}
      />
      <Card
        label="Favorites"
        value={String(favorites)}
        caption={favoritesCaption}
        href={favoritesHref}
      />
      <Card
        inverted
        label="Last viewed"
        value={padNo(TRAINER.lastViewed)}
        caption={lastViewed?.name}
      />
    </Grid>
    <Menu
      aria-label="Sections"
      {items}
      activeIndex={nav.index}
      onactivate={(i) => (nav.index = i)}
      oncursor={(i) => (nav.index = i)}
    />
  </Stack>
  <Hints hints={[{ key: "A", label: "Open" }]} />
</ScreenBody>
