<script module lang="ts">
/**
 * How long a toast stays before it asks to be dismissed. Behaviour, not a
 * CSS value: tokens.css tops out at --step-slow (250ms), and a message
 * needs a few seconds to be read.
 */
export const TOAST_DURATION_MS = 4000;
</script>

<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

let {
  children,
  duration = TOAST_DURATION_MS,
  ondismiss,
  ...rest
}: {
  children: Snippet;
  /** Milliseconds before `ondismiss` fires. */
  duration?: number;
  /**
   * Called once when the toast has been shown for `duration`. The caller
   * owns whether the toast is rendered, so it removes the toast here.
   * Without a handler the toast stays until the caller takes it down.
   */
  ondismiss?: () => void;
} & HTMLAttributes<HTMLDivElement> = $props();

// The timer dies with the component, so a toast taken down early (a route
// change, a caller removing it) never fires a dismiss into thin air.
$effect(() => {
  if (!ondismiss) return;
  const timer = setTimeout(ondismiss, duration);
  return () => clearTimeout(timer);
});
</script>

<div {...rest} class={["dex-toast", rest.class]} role={rest.role ?? "status"}>
  {@render children()}
</div>
