<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  src,
  alt,
  lg = false,
  inverted = false,
  ...rest
}: {
  src: string;
  alt: string;
  lg?: boolean;
  inverted?: boolean;
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
  <img {src} {alt} loading="lazy" decoding="async" />
</div>
