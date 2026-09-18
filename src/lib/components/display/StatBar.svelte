<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  label,
  name,
  value,
  max = 255,
  ...rest
}: {
  label: string;
  name?: string;
  value: number;
  max?: number;
} & HTMLAttributes<HTMLDivElement> = $props();

const pct = $derived(
  max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0,
);

// Absolute base-stat thresholds, not percentages. Base stats rarely pass
// 150, so a share of 255 would paint nearly every bar red.
const level = $derived(value < 60 ? "low" : value < 100 ? "mid" : undefined);
</script>

<div
  {...rest}
  class={["dex-bar", rest.class]}
  style:--value={pct}
  role="meter"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-label={name ?? label}
  data-level={level}
>
  <span class="dex-bar__label">{label}</span>
  <div class="dex-bar__track"><div class="dex-bar__fill"></div></div>
  <span class="dex-bar__value">{value}</span>
</div>
