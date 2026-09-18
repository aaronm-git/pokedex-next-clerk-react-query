<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  hints,
  ...rest
}: {
  hints: { key: string; label: string }[];
} & HTMLAttributes<HTMLElement> = $props();
</script>

<footer {...rest} class={["dex-hints", rest.class]}>
  {#each hints as hint (hint.key)}
    <span><kbd>{hint.key}</kbd>{hint.label}</span>
  {/each}
</footer>
