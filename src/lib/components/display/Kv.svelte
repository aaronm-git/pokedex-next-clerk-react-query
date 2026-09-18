<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  rows,
  ...rest
}: {
  rows: { label: string; value: string }[];
} & HTMLAttributes<HTMLDListElement> = $props();
</script>

<dl {...rest} class={["dex-kv", rest.class]}>
  {#each rows as row (row.label)}
    <dt>{row.label}</dt>
    <dd>{row.value}</dd>
  {/each}
</dl>
