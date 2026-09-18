<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  src,
  alt,
  lg = false,
  inverted = false,
  eager = false,
  ...rest
}: {
  src: string;
  alt: string;
  lg?: boolean;
  inverted?: boolean;
  /**
   * Load at once instead of lazily. For the sprite that is the largest
   * paint on a screen, such as the landing page hero; lazy-loading that one
   * delays exactly the paint that matters.
   */
  eager?: boolean;
} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  {...rest}
  class={[
    "dex-sprite",
    lg && "dex-sprite--lg",
    inverted && "dex-sprite--inverted",
    rest.class,
  ]}
>
  <img
  {src}
  {alt}
  loading={eager ? "eager" : "lazy"}
  fetchpriority={eager ? "high" : undefined}
  decoding="async"
/>
</div>
