<script lang="ts">
import GameBoy from "$lib/components/device/GameBoy.svelte";
import {
  createDeck,
  keydown,
  release,
  setDeck,
} from "$lib/components/nav/deck.svelte";
import "$styles/index.css";

let { children } = $props();

// One deck for the whole app. Screens take it with `onDeck(handler)`; the
// keyboard and the on-screen buttons both arrive through `deck.press`.
const deck = setDeck(createDeck());
</script>

<svelte:head>
  <title>Pokédex</title>
  <meta
    name="description"
    content="A Pokédex that runs on a Game Boy Color. Browse Pokémon on the LCD with the D-pad and buttons. Built with SvelteKit and PokeAPI."
  />
</svelte:head>

<!-- A key holds its on-screen button down until keyup, or until the window
     loses focus with the key still down. -->
<svelte:window
  onkeydown={(event) => keydown(deck, event)}
  onkeyup={() => release(deck)}
  onblur={() => release(deck)}
/>

<GameBoy onpress={deck.press} pressed={deck.pressed}>
  {@render children()}
</GameBoy>
