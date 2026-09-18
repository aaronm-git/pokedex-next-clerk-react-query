import type { Attachment } from "svelte/attachments";
import { isTypingTarget } from "./keys";

/**
 * Focus follows the cursor. When the item this is attached to becomes the
 * current one, it takes DOM focus, so a screen reader announces where the
 * D-pad moved. That is the whole accessibility story for the cursor: the
 * item's own `aria-current` says it is current, and focus says so out loud.
 *
 * Two deliberate gaps. It never focuses on mount, because a page must not
 * grab focus as it loads. And it stands aside while someone is typing: a
 * search field that filters the list moves the clamped cursor on every
 * keystroke, and stealing focus from the field would end the search.
 */
export function focusWhenCurrent(
  current: () => boolean,
): Attachment<HTMLElement> {
  return (element) => {
    let mounted = false;
    $effect(() => {
      const isCurrent = current();
      if (isCurrent && mounted && !isTypingTarget(document.activeElement)) {
        element.focus();
      }
      mounted = true;
    });
  };
}
