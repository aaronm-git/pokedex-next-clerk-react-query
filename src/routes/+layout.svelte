<script lang="ts">
import GameBoy from "$lib/components/device/GameBoy.svelte";
import "$styles/index.css";

let { children } = $props();
</script>

<GameBoy>
  {@render children()}
</GameBoy>
