<script module lang="ts">
export type MenuItem = {
  id: string;
  label: string;
  href?: string;
  hint?: string;
  disabled?: boolean;
};
</script>

<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { focusWhenCurrent } from "../nav/focus.svelte";

// Keyboard is native only: Tab reaches each link or button, Enter (and Space
// on buttons) activates. No arrow keys and no roving tabindex here. The D-pad
// and the global arrow keys belong to the navigation store, which moves
// `activeIndex`; a second owner inside this component would fight it.
//
// Focus and the cursor do stay together, in both directions: the item that
// becomes current takes focus (so assistive tech hears the D-pad move), and
// an item that gains focus by Tab or click reports itself through `oncursor`
// so the store can move the cursor to it.

let {
  items,
  activeIndex,
  onactivate,
  oncursor,
  row = false,
  ...rest
}: {
  items: MenuItem[];
  activeIndex: number;
  onactivate?: (index: number) => void;
  oncursor?: (index: number) => void;
  row?: boolean;
} & HTMLAttributes<HTMLElement> = $props();

function activate(item: MenuItem, index: number) {
  if (!item.disabled) onactivate?.(index);
}

function onfocusin(event: FocusEvent & { currentTarget: HTMLElement }) {
  if (!oncursor || !(event.target instanceof Element)) return;
  const item = event.target.closest(".dex-menu__item");
  if (!item) return;
  const all = event.currentTarget.querySelectorAll(".dex-menu__item");
  const index = Array.prototype.indexOf.call(all, item);
  if (index >= 0) oncursor(index);
}
</script>

{#snippet content(item: MenuItem)}
  {item.label}
  {#if item.hint}
    <span class="dex-menu__hint">{item.hint}</span>
  {/if}
{/snippet}

<!-- Explicit <a> / <button> branches rather than <svelte:element>: the
     compiler cannot see that a dynamic tag is always interactive, so a click
     handler on it trips a11y_no_static_element_interactions. -->
<nav
  {...rest}
  class={["dex-menu", row && "dex-menu--row", rest.class]}
  {onfocusin}
>
  {#each items as item, i (item.id)}
    {#if item.href}
      <!-- A disabled link drops its href: an anchor without href is not
           focusable and not a link, the native "placeholder link". -->
      {@const href = item.disabled ? undefined : item.href}
      <!-- href is the caller's, already resolved: resolve() on a literal
           route id is type-checked at the call site, and resolving again here
           would double-prefix paths.base. The svelte-autofixer flags this
           href as "without resolve()" for that reason; it is deliberate. -->
      <a
        class="dex-menu__item"
        {href}
        aria-disabled={item.disabled ? "true" : undefined}
        aria-current={i === activeIndex ? "true" : undefined}
        onclick={() => activate(item, i)}
        {@attach focusWhenCurrent(() => i === activeIndex)}
      >
        {@render content(item)}
      </a>
    {:else}
      <button
        type="button"
        class="dex-menu__item"
        disabled={item.disabled ? true : undefined}
        aria-disabled={item.disabled ? "true" : undefined}
        aria-current={i === activeIndex ? "true" : undefined}
        onclick={() => activate(item, i)}
        {@attach focusWhenCurrent(() => i === activeIndex)}
      >
        {@render content(item)}
      </button>
    {/if}
  {/each}
</nav>
