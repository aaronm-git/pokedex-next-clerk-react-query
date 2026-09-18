<script lang="ts">
import type { SVGAttributes } from "svelte/elements";
import { ICON_PATHS, type IconName } from "$lib/icons/paths";

let {
  name,
  label,
  dots = 12,
  ...rest
}: {
  /** Key into the extracted icon set. */
  name: IconName;
  /** Accessible name. Without one the icon is decorative and hidden from AT. */
  label?: string;
  /** Rendered size in hardware dots. 12 dots is 24px at the default scale. */
  dots?: number;
} & SVGAttributes<SVGSVGElement> = $props();

const d = $derived(ICON_PATHS[name]);
</script>

<svg
  {...rest}
  class={rest.class}
  viewBox="0 0 24 24"
  fill="currentColor"
  shape-rendering="crispEdges"
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : "true"}
  style:--icon-dots={dots}
>
  <path {d} />
</svg>

<style>
  svg {
    display: inline-block;
    width: calc(var(--dot) * var(--icon-dots));
    height: calc(var(--dot) * var(--icon-dots));
    vertical-align: middle;
    flex: none;
  }
</style>
