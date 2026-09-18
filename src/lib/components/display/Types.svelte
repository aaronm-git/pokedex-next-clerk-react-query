<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

// The row of type badges on the detail screen (components.css, "Type
// badge": .dex-types). Tighter than Cluster, which is why it is its own
// wrapper rather than a Cluster with badges in it.

let {
  children,
  ...rest
}: { children: Snippet } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} class={["dex-types", rest.class]}>
  {@render children()}
</div>
