<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  count = 1,
  ...rest
}: {
  count?: number;
} & HTMLAttributes<HTMLDivElement> = $props();

// The bars are identical placeholders, so their position is the only
// identity they have. That is why the each block keys on the index.
const bars = $derived(Array.from({ length: count }, (_, i) => i));
</script>

{#if count > 1}
  <div {...rest} class={["dex-stack", "dex-stack--tight", rest.class]}>
    {#each bars as i (i)}
      <div class="dex-skeleton" aria-hidden="true"></div>
    {/each}
  </div>
{:else}
  <div aria-hidden="true" {...rest} class={["dex-skeleton", rest.class]}></div>
{/if}
