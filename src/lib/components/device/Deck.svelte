<script lang="ts">
import { DECK_DIRECTIONS, type DeckButton } from "./deck";

let { onpress }: { onpress?: (button: DeckButton) => void } = $props();

const label = (button: DeckButton) =>
  button.charAt(0).toUpperCase() + button.slice(1);
</script>

<div class="gb-deck">
  <div class="gb-dpad">
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
        class="gb-ab__btn gb-ab__btn--b"
        aria-label="B"
        onclick={() => onpress?.("b")}>B</button
      >
    </div>
    <div>
      <button class="gb-ab__btn" aria-label="A" onclick={() => onpress?.("a")}
        >A</button
      >
    </div>
  </div>

  <div class="gb-pills">
    <div class="gb-pill">
      <button
        class="gb-pill__btn"
        aria-label="Select"
        onclick={() => onpress?.("select")}
      ></button>
      <span class="gb-pill__label">Select</span>
    </div>
    <div class="gb-pill">
      <button
        class="gb-pill__btn"
        aria-label="Start"
        onclick={() => onpress?.("start")}
      ></button>
      <span class="gb-pill__label">Start</span>
    </div>
  </div>
</div>
