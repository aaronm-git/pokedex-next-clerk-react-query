<script lang="ts">
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import Hints from "$lib/components/display/Hints.svelte";
import Sprite from "$lib/components/display/Sprite.svelte";
import Button from "$lib/components/input/Button.svelte";
import ScreenBody from "$lib/components/layout/ScreenBody.svelte";
import Stack from "$lib/components/layout/Stack.svelte";
import { onDeck } from "$lib/components/nav/deck.svelte";
import { spriteUrl } from "$lib/fixtures/pokemon";

const demoHref = resolve("/app/dashboard");
const loginHref = resolve("/login");

// The links carry the hrefs; the deck only mirrors them so Start and A land
// on the same URL as a click. When a link has focus, Enter is native and the
// deck stands aside, so nothing navigates twice.
onDeck((button) => {
  if (button === "start") goto(demoHref);
  if (button === "a") goto(loginHref);
});
</script>

<ScreenBody>
  <Stack
    class="t-center"
    style="justify-items:center;padding-top:var(--space-4)"
  >
    <Sprite lg src={spriteUrl(25)} alt="Pikachu" />
    <h1 class="t-label-xl">Pokédex</h1>
    <p class="t-body">
      A Kanto Pokédex you can carry in your pocket. Browse 151 entries, read
      the stats, keep favorites. Built with SvelteKit, plain CSS and a
      magic-link login.
    </p>
    <Button variant="start" href={demoHref}>Try the demo</Button>
    <Button sm href={loginHref}>Log in</Button>
  </Stack>
  <Hints
    hints={[
      { key: "Start", label: "Demo" },
      { key: "A", label: "Log in" },
    ]}
  />
</ScreenBody>
