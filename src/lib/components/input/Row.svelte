<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import Ball from "../display/Ball.svelte";

let {
  number,
  name,
  owned = false,
  unseen = false,
  thumb,
  current = false,
  href,
  end,
  ...rest
}: {
  number: number;
  name: string;
  owned?: boolean;
  unseen?: boolean;
  thumb?: string;
  current?: boolean;
  href?: string;
  end?: Snippet;
} & HTMLAttributes<HTMLElement> = $props();

// A row is a link or a button, never a div (components.css, "Dex row").
const tag = $derived(href ? "a" : "button");

// Gen 1 always shows three digits: 001, 025, 151.
const no = $derived(String(number).padStart(3, "0"));
</script>

<svelte:element
  this={tag}
  aria-label={unseen ? `${no} unseen` : undefined}
  {...rest}
  {href}
  type={href ? undefined : "button"}
  class={[
    "dex-row",
    unseen && "dex-row--unseen",
    thumb && "dex-row--thumb",
    rest.class,
  ]}
  aria-current={current ? "true" : undefined}
>
  <span class="dex-row__no">{no}</span>
  {#if unseen}
    <!-- Placeholder keeps the four-column grid; the CSS draws the dashes. -->
    <i></i>
    <span class="dex-row__name"></span>
  {:else}
    {#if thumb}
      <img class="dex-row__thumb" src={thumb} alt="" />
    {:else}
      <Ball filled={owned} />
    {/if}
    <span class="dex-row__name">{name}</span>
  {/if}
  <span class="dex-row__end">{@render end?.()}</span>
</svelte:element>
