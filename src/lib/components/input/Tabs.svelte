<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

// APG tabs pattern: roving tabindex, automatic activation (selection follows
// focus). A tablist is a composite widget, so while it has focus it owns its
// arrow keys. Selection itself is the parent's: `activeIndex` in, `onactivate`
// out, no local state.

let {
  tabs,
  activeIndex,
  onactivate,
  panel,
  ...rest
}: {
  tabs: string[];
  activeIndex: number;
  onactivate?: (index: number) => void;
  panel?: Snippet<[number]>;
} & HTMLAttributes<HTMLDivElement> = $props();

const uid = $props.id();
const panelId = $derived(panel ? `${uid}-panel` : undefined);

function onkeydown(event: KeyboardEvent & { currentTarget: HTMLDivElement }) {
  const last = tabs.length - 1;
  let next: number;
  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      next = activeIndex >= last ? 0 : activeIndex + 1;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = activeIndex <= 0 ? last : activeIndex - 1;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = last;
      break;
    default:
      return;
  }
  event.preventDefault();
  // The tablist consumed this arrow. Stop it so a window-level handler (the
  // D-pad / global arrow navigation) does not move the app cursor as well.
  event.stopPropagation();
  onactivate?.(next);
  // Focus the target tab by querying the tablist rather than holding refs:
  // the buttons are rendered in order, so the nth role=tab is tab n.
  const buttons =
    event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
  buttons[next]?.focus();
}
</script>

<!-- Labels are the each key, so they must be unique within one tablist. -->
<div {...rest} class={["dex-tabs", rest.class]} role="tablist" {onkeydown}>
  {#each tabs as label, i (label)}
    <button
      type="button"
      class="dex-tabs__tab"
      role="tab"
      id="{uid}-tab-{i}"
      aria-selected={i === activeIndex ? "true" : "false"}
      aria-controls={panelId}
      tabindex={i === activeIndex ? 0 : -1}
      onclick={() => onactivate?.(i)}
    >
      {label}
    </button>
  {/each}
</div>
{#if panel}
  <!-- One panel whose content swaps, so every tab's aria-controls resolves. -->
  <div
    class="dex-tabpanel"
    role="tabpanel"
    id={panelId}
    aria-labelledby="{uid}-tab-{activeIndex}"
    tabindex="0"
  >
    {@render panel(activeIndex)}
  </div>
{/if}
