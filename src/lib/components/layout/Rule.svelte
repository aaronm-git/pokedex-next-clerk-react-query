<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let {
  dashed = false,
  ...rest
}: { dashed?: boolean } & HTMLAttributes<HTMLHRElement> = $props();
</script>

<hr {...rest} class={["dex-rule", dashed && "dex-rule--dashed", rest.class]} />
