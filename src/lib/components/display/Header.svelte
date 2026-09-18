<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  title,
  meta = [],
  level = 1,
  ...rest
}: {
  title: string;
  meta?: { label: string; value: string }[];
  level?: 1 | 2;
} & HTMLAttributes<HTMLElement> = $props();
</script>

<header {...rest} class={["dex-header", rest.class]}>
  <svelte:element this={"h" + level} class="dex-header__title">
    {title}
  </svelte:element>
  {#if meta.length > 0}
    <div class="dex-header__meta">
      {#each meta as item (item.label)}
        <span>{item.label} <b>{item.value}</b></span>
      {/each}
    </div>
  {/if}
</header>
