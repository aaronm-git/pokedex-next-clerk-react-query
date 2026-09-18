<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

let {
  variant,
  sm = false,
  block = false,
  disabled = false,
  loading = false,
  pressed,
  href,
  children,
  ...rest
}: {
  variant?: "primary" | "danger" | "start";
  sm?: boolean;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;
  href?: string;
  children: Snippet;
} & HTMLButtonAttributes = $props();

const tag = $derived(href ? "a" : "button");
// A loading button is also a disabled one: no click can fire while it waits.
const inactive = $derived(disabled || loading);
</script>

<!-- A disabled or loading link drops its href: an anchor without href is not
     focusable and not a link, which is the native "placeholder link". -->
<svelte:element
  this={tag}
  type={href ? undefined : "button"}
  {...rest}
  class={[
    "dex-btn",
    variant && `dex-btn--${variant}`,
    sm && "dex-btn--sm",
    block && "dex-btn--block",
    loading && "is-loading",
    rest.class,
  ]}
  href={href && !inactive ? href : undefined}
  disabled={!href && inactive ? true : undefined}
  aria-disabled={href && inactive ? "true" : undefined}
  aria-busy={loading ? "true" : undefined}
  aria-pressed={pressed}
>
  {@render children()}
</svelte:element>
