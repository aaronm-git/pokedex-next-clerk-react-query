<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  filled = false,
  ...rest
}: {
  filled?: boolean;
} & HTMLAttributes<HTMLElement> = $props();
</script>

<i
  aria-hidden="true"
  {...rest}
  class={["dex-ball", filled && "dex-ball--filled", rest.class]}
></i>
