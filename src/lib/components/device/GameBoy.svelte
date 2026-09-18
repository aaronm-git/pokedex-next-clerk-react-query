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
