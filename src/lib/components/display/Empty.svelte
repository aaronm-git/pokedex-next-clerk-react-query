<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

let {
  title,
  children,
  ...rest
}: {
  title: string;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} class={["dex-empty", rest.class]}>
  <span>{title}</span>
  {#if children}
    {@render children()}
  {/if}
</div>
