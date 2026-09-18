<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

// Sibling buttons sharing one rhythm (components.css, "Button group").

let {
  children,
  ...rest
}: { children: Snippet } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} class={["dex-btn-group", rest.class]}>
  {@render children()}
</div>
