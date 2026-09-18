<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

let {
  tone,
  title,
  children,
  ...rest
}: {
  tone?: "ok" | "warn" | "error";
  title?: string;
  children: Snippet;
} & HTMLAttributes<HTMLDivElement> = $props();

const role = $derived(rest.role ?? (tone === "error" ? "alert" : "status"));
</script>

<div {...rest} class={["dex-notice", tone && `dex-notice--${tone}`, rest.class]} {role}>
  {#if title}
    <span class="dex-notice__title">{title}</span>
  {/if}
  <p>{@render children()}</p>
</div>
