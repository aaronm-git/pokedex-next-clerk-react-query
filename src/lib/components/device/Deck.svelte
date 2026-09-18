<script lang="ts">
import { isDirection } from "../nav/keys";
import { DECK_DIRECTIONS, type DeckButton } from "./deck";

// `pressed` is the button a held key is holding down. Pointer presses need
// nothing here: the CSS draws :active itself.
let {
  onpress,
  pressed = null,
}: {
  onpress?: (button: DeckButton) => void;
  pressed?: DeckButton | null;
} = $props();

const label = (button: DeckButton) =>
  button.charAt(0).toUpperCase() + button.slice(1);
</script>

<div class="gb-deck" role="group" aria-label="Controls">
  <div class={["gb-dpad", isDirection(pressed) && "is-pressed"]}>
    {#each DECK_DIRECTIONS as dir (dir)}
      <button
        class="gb-dpad__btn"
        data-dir={dir}
        aria-label={label(dir)}
        onclick={() => onpress?.(dir)}
      ></button>
    {/each}
    <i class="gb-dpad__center"></i>
  </div>

  <div class="gb-ab">
    <div>
      <button
        class={["gb-ab__btn", "gb-ab__btn--b", pressed === "b" && "is-pressed"]}
        aria-label="B"
        onclick={() => onpress?.("b")}>B</button
      >
    </div>
    <div>
      <button
        class={["gb-ab__btn", pressed === "a" && "is-pressed"]}
        aria-label="A"
        onclick={() => onpress?.("a")}>A</button
      >
    </div>
  </div>

  <div class="gb-pills">
    <div class="gb-pill">
      <button
        class={["gb-pill__btn", pressed === "select" && "is-pressed"]}
        aria-label="Select"
        onclick={() => onpress?.("select")}
      ></button>
      <span class="gb-pill__label">Select</span>
    </div>
    <div class="gb-pill">
      <button
        class={["gb-pill__btn", pressed === "start" && "is-pressed"]}
        aria-label="Start"
        onclick={() => onpress?.("start")}
      ></button>
      <span class="gb-pill__label">Start</span>
    </div>
  </div>
</div>
