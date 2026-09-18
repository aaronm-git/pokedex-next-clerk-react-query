<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

let {
  tight = false,
  children,
  ...rest
}: {
  tight?: boolean;
  children: Snippet;
} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} class={["dex-stack", tight && "dex-stack--tight", rest.class]}>
  {@render children()}
</div>
