<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  type,
  ...rest
}: {
  type: string;
} & HTMLAttributes<HTMLSpanElement> = $props();

const slug = $derived(type.toLowerCase());
</script>

<span {...rest} class={["dex-type", rest.class]} data-type={slug}>{type}</span>
