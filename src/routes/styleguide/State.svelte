<script lang="ts">
import type { Snippet } from "svelte";
import Cluster from "$lib/components/layout/Cluster.svelte";
import Stack from "$lib/components/layout/Stack.svelte";

// One labelled state in the guide: a caption in the hint voice, then the
// component. Inline states (a button, a badge) sit beside their caption so
// they keep their natural width; block states (a box, a field) sit under it.
//
// `muted` is off on the inverted LCD: `.t-mid` has no inverted rule in the
// design system and reads at about 2.8:1 on black, under AA.

let {
  label,
  inline = false,
  muted = true,
  children,
}: {
  label: string;
  inline?: boolean;
  muted?: boolean;
  children: Snippet;
} = $props();
</script>

{#if inline}
  <Cluster>
    <span class={["t-label-xs", muted && "t-mid"]}>{label}</span>
    {@render children()}
  </Cluster>
{:else}
  <Stack tight>
    <span class={["t-label-xs", muted && "t-mid"]}>{label}</span>
    {@render children()}
  </Stack>
{/if}
