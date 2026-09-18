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

let {
  rows,
  activeIndex,
  onactivate,
  end,
  ...rest
}: {
  rows: RowData[];
  activeIndex: number;
  onactivate?: (index: number) => void;
  end?: Snippet<[RowData, number]>;
} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} class={["dex-list", rest.class]}>
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
