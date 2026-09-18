<script lang="ts">
import GameBoy from "$lib/components/device/GameBoy.svelte";
import "$styles/index.css";

let { children } = $props();
</script>

<svelte:head>
  <title>Pokédex</title>
  <meta
    name="description"
    content="A Pokédex that runs on a Game Boy Color. Browse Pokémon on the LCD with the D-pad and buttons. Built with SvelteKit and PokeAPI."
  />
</svelte:head>

<GameBoy>
  {@render children()}
</GameBoy>
