<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

// A stack of StatBars (components.css, "Stat bar": .dex-bars). Tighter
// than Stack, which is why it is its own wrapper.

let {
  children,
  ...rest
}: { children: Snippet } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} class={["dex-bars", rest.class]}>
  {@render children()}
</div>
