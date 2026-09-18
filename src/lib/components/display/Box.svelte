<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

let {
  title,
  thick = false,
  single = false,
  flush = false,
  inverted = false,
  children,
  ...rest
}: {
  title?: string;
  thick?: boolean;
  single?: boolean;
  flush?: boolean;
  inverted?: boolean;
  children: Snippet;
} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  {...rest}
  class={[
    "dex-box",
    thick && "dex-box--thick",
    single && "dex-box--single",
    inverted && "dex-box--inverted",
    flush && "dex-box--flush",
    rest.class,
  ]}
>
  {#if title}
    <span class="dex-box__title">{title}</span>
  {/if}
  {@render children()}
</div>
