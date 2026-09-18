<script lang="ts">
import { type Component, untrack } from "svelte";
import {
  createDeck,
  type Deck,
  setDeck,
} from "$lib/components/nav/deck.svelte";

// Test-only. A screen calls `onDeck` during init, which reads the deck from
// context, so a screen rendered on its own throws. This puts a deck in
// context the way the root layout does, and hands the same deck back so a
// test can press its buttons.

let {
  screen,
  props,
  deck = createDeck(),
}: {
  // biome-ignore lint/suspicious/noExplicitAny: a seam for any screen; Biome cannot parse a generic <script>
  screen: Component<any>;
  props: Record<string, unknown>;
  deck?: Deck;
} = $props();

// Context is set once at init; the deck never changes for a rendered screen.
setDeck(untrack(() => deck));
const Screen = $derived(screen);
</script>

<Screen {...props} />
