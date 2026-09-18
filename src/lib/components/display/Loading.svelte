<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

let {
  label = "Loading",
  children,
  ...rest
}: {
  label?: string;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<!-- role="status" sits before the spread so a caller can override it. -->
<div role="status" {...rest} class={["dex-loading", rest.class]}>
  <span class="dex-loading__dots">{label}</span>
  {#if children}
    <p>{@render children()}</p>
  {/if}
</div>
