<script module lang="ts">
export type RowData = {
  id: string | number;
  number: number;
  name: string;
  owned?: boolean;
  unseen?: boolean;
  thumb?: string;
  href?: string;
};
</script>

<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import Row from "./Row.svelte";

// Focus and the cursor travel together. The current row takes focus (Row
// does that), and a row that gains focus by Tab or click reports itself
// through `oncursor` so the store can move the cursor there.

let {
  rows,
  activeIndex,
  onactivate,
  oncursor,
  end,
  ...rest
}: {
  rows: RowData[];
  activeIndex: number;
  onactivate?: (index: number) => void;
  oncursor?: (index: number) => void;
  end?: Snippet<[RowData, number]>;
} & HTMLAttributes<HTMLDivElement> = $props();

function onfocusin(event: FocusEvent & { currentTarget: HTMLDivElement }) {
  if (!oncursor || !(event.target instanceof Element)) return;
  const row = event.target.closest(".dex-row");
  if (!row) return;
  const all = event.currentTarget.querySelectorAll(".dex-row");
  const index = Array.prototype.indexOf.call(all, row);
  if (index >= 0) oncursor(index);
}
</script>

<div {...rest} class={["dex-list", rest.class]} {onfocusin}>
  {#each rows as row, i (row.id)}
    {#snippet rowEnd()}{@render end?.(row, i)}{/snippet}
    <Row
      number={row.number}
      name={row.name}
      owned={row.owned}
      unseen={row.unseen}
      thumb={row.thumb}
      href={row.href}
      current={i === activeIndex}
      end={rowEnd}
      onclick={() => onactivate?.(i)}
    />
  {/each}
</div>
