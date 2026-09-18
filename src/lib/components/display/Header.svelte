<script module lang="ts">
/**
 * One entry in the header's meta strip. Four shapes, all from the style
 * guide: `Seen <b>151</b>` (label then value), `<b>12</b> saved` (value
 * first), a bare label such as an email address, and a bare value.
 */
export type HeaderMeta = {
  label?: string;
  value?: string;
  valueFirst?: boolean;
};
</script>

<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  title,
  meta = [],
  level = 1,
  ...rest
}: {
  title: string;
  meta?: HeaderMeta[];
  level?: 1 | 2;
} & HTMLAttributes<HTMLElement> = $props();
</script>

<header {...rest} class={["dex-header", rest.class]}>
  <svelte:element this={"h" + level} class="dex-header__title">
    {title}
  </svelte:element>
  {#if meta.length > 0}
    <div class="dex-header__meta">
      <!-- Keyed on whichever text the entry carries; a strip never repeats
           the same label or the same bare value. -->
      {#each meta as item (item.label ?? item.value)}
        <span>
          {#if item.valueFirst && item.value}<b>{item.value}</b> {item.label}
          {:else if item.label && item.value}{item.label} <b>{item.value}</b>
          {:else if item.value}<b>{item.value}</b>
          {:else}{item.label}{/if}
        </span>
      {/each}
    </div>
  {/if}
</header>
