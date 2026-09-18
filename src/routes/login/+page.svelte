<script lang="ts">
import { tick } from "svelte";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import Box from "$lib/components/display/Box.svelte";
import Header from "$lib/components/display/Header.svelte";
import Hints from "$lib/components/display/Hints.svelte";
import Notice from "$lib/components/display/Notice.svelte";
import Button from "$lib/components/input/Button.svelte";
import Field from "$lib/components/input/Field.svelte";
import ScreenBody from "$lib/components/layout/ScreenBody.svelte";
import Stack from "$lib/components/layout/Stack.svelte";
import { onDeck } from "$lib/components/nav/deck.svelte";

const EMAIL_ID = "login-email";

let email = $state("");
let sent = $state(false);
let form = $state<HTMLFormElement | null>(null);

// Phase 4 sends the magic link here. Until then the form only flips state, and
// every submit path (Enter in the field, the button, the deck's A) lands here.
function send(event: SubmitEvent) {
  event.preventDefault();
  sent = true;
}

// Returning to the form is a new interaction context: the field the user will
// edit next should already have focus, so the keyboard picks up where it left.
async function edit() {
  sent = false;
  await tick();
  document.getElementById(EMAIL_ID)?.focus();
}

// A goes through requestSubmit so constraint validation runs the same as a
// click on the submit button would; an empty or malformed email stays put.
onDeck((button) => {
  if (button === "a" && !sent) form?.requestSubmit();
  if (button === "b") {
    if (sent) edit();
    else goto(resolve("/"));
  }
});

const hints = $derived(
  sent
    ? [{ key: "B", label: "Back" }]
    : [
        { key: "A", label: "Send" },
        { key: "B", label: "Back" },
      ],
);
</script>

<ScreenBody>
  <Header title="Log in" />
  {#if sent}
    <Stack>
      <Notice tone="ok" title="Link sent">
        Check <b>{email}</b>. If it is not there in a minute, look in spam. Mail
        from new domains lands there more than it should.
      </Notice>
      <Box>
        <p class="t-body t-cursor">Waiting for you to click the link</p>
      </Box>
      <Button onclick={edit}>Use a different email</Button>
    </Stack>
  {:else}
    <form bind:this={form} onsubmit={send}>
      <Stack>
        <p class="t-body">Enter your email. We send a link; no password to remember.</p>
        <Field
          label="Email"
          type="email"
          placeholder="ash@pallet.town"
          autocomplete="email"
          required
          id={EMAIL_ID}
          bind:value={email}
        />
        <Button variant="primary" block type="submit">Send link</Button>
      </Stack>
    </form>
  {/if}
  <Hints {hints} />
</ScreenBody>
