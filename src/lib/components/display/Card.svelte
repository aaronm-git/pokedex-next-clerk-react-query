<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  label,
  value,
  caption,
  inverted = false,
  href,
  ...rest
}: {
  label: string;
  value: string;
  caption?: string;
  inverted?: boolean;
  href?: string;
} & HTMLAttributes<HTMLElement> = $props();

const tag = $derived(href ? "a" : "div");
</script>

<svelte:element
  this={tag}
  {...rest}
  {href}
  class={[
    "dex-card",
    inverted && "dex-card--inverted",
    href && "dex-card--link",
    rest.class,
  ]}
>
  <span class="dex-card__label">{label}</span>
  <span class="dex-card__value">{value}</span>
  {#if caption}
    <span class="dex-card__caption">{caption}</span>
  {/if}
</svelte:element>
