<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

let {
  cols,
  children,
  ...rest
}: { cols?: 2 | 3; children: Snippet } & HTMLAttributes<HTMLDivElement> =
  $props();
</script>

<div {...rest} class={["dex-grid", cols && `dex-grid--${cols}`, rest.class]}>
  {@render children()}
</div>
