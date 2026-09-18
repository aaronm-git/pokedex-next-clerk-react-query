<script lang="ts">
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import Deck from "$lib/components/device/Deck.svelte";
import type { DeckButton } from "$lib/components/device/deck";
import Ball from "$lib/components/display/Ball.svelte";
import Bars from "$lib/components/display/Bars.svelte";
import Box from "$lib/components/display/Box.svelte";
import Card from "$lib/components/display/Card.svelte";
import Empty from "$lib/components/display/Empty.svelte";
import Header from "$lib/components/display/Header.svelte";
import Hints from "$lib/components/display/Hints.svelte";
import Icon from "$lib/components/display/Icon.svelte";
import Kv from "$lib/components/display/Kv.svelte";
import Loading from "$lib/components/display/Loading.svelte";
import Notice from "$lib/components/display/Notice.svelte";
import Skeleton from "$lib/components/display/Skeleton.svelte";
import Sprite from "$lib/components/display/Sprite.svelte";
import StatBar from "$lib/components/display/StatBar.svelte";
import Toast from "$lib/components/display/Toast.svelte";
import TypeBadge from "$lib/components/display/TypeBadge.svelte";
import Types from "$lib/components/display/Types.svelte";
import Button from "$lib/components/input/Button.svelte";
import ButtonGroup from "$lib/components/input/ButtonGroup.svelte";
import Field from "$lib/components/input/Field.svelte";
import List, { type RowData } from "$lib/components/input/List.svelte";
import Menu, { type MenuItem } from "$lib/components/input/Menu.svelte";
import Tabs from "$lib/components/input/Tabs.svelte";
import Cluster from "$lib/components/layout/Cluster.svelte";
import Grid from "$lib/components/layout/Grid.svelte";
import Rule from "$lib/components/layout/Rule.svelte";
import ScreenBody from "$lib/components/layout/ScreenBody.svelte";
import Split from "$lib/components/layout/Split.svelte";
import Stack from "$lib/components/layout/Stack.svelte";
import { onDeck } from "$lib/components/nav/deck.svelte";
import { createListNavigation } from "$lib/components/nav/navigation.svelte";
import { spriteUrl } from "$lib/fixtures/pokemon";
import { ICON_PATHS, type IconName } from "$lib/icons/paths";
import State from "./State.svelte";

// The living style guide. Every component in every state, on the real LCD,
// grouped the way docs/design/style-guide.html groups them. Nothing here
// is fetched; the sprites are the same PokeAPI URLs the fixtures use.

let { inverted = false }: { inverted?: boolean } = $props();

// ---- Sections and the deck ------------------------------------------------
// The table of contents is a Menu the D-pad drives: up and down move the
// cursor, A jumps to the section, B leaves for the landing page. Without a
// deck listener the layout's arrow keys would be claimed and do nothing,
// which on a page this long would be a dead keyboard.
const SECTIONS = [
  { id: "palette", label: "Palette" },
  { id: "type", label: "Type" },
  { id: "device", label: "Device" },
  { id: "layout", label: "Layout" },
  { id: "components", label: "Components" },
  { id: "screens", label: "Screens" },
];
const toc: MenuItem[] = SECTIONS.map((s) => ({
  id: s.id,
  label: s.label,
  href: `#${s.id}`,
}));

function jump(index: number) {
  // The heading is focusable (tabindex -1), so focusing it scrolls the LCD
  // and moves the reading position in one go. The hash link alone does not:
  // the router scrolls the window to the hash, and the LCD is an overflow
  // container inside it that stays put.
  nav.index = index;
  document.getElementById(SECTIONS[index].id)?.focus();
}

const nav = createListNavigation({
  length: () => SECTIONS.length,
  onselect: jump,
  onback: () => goto(resolve("/")),
});
onDeck(nav.handle);

const twinHref = $derived(
  inverted ? resolve("/styleguide") : resolve("/styleguide/inverted"),
);

// ---- Demo state -----------------------------------------------------------
// Each interactive demo owns its cursor; only the table of contents is on the
// deck, so the demos answer to clicks and Tab, not to the D-pad.
let menuIndex = $state(0);
let rowMenuIndex = $state(1);
let listIndex = $state(1);
let buttonListIndex = $state(0);
let tab = $state(0);
let bareTab = $state(1);
let togglePressed = $state(true);
let favorite = $state(false);
let demoPressed = $state<DeckButton | null>("down");
let filled = $state("ash@pallet.town");
let query = $state("char");
let toast = $state(false);

const TYPES = [
  "Normal",
  "Fire",
  "Water",
  "Electric",
  "Grass",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
];

const ICONS = Object.keys(ICON_PATHS) as IconName[];

const menuItems: MenuItem[] = [
  { id: "data", label: "Data" },
  { id: "cry", label: "Cry" },
  { id: "area", label: "Area", disabled: true },
  { id: "fav", label: "Favorites", hint: "12" },
  { id: "quit", label: "Quit" },
];
const rowMenuItems: MenuItem[] = [
  { id: "page", label: "Page" },
  { id: "area", label: "Area" },
  { id: "cry", label: "Cry" },
];

function detailHref(id: number) {
  return resolve("/app/pokemon/[id]", { id: String(id) });
}

// The static guide's row set: owned, owned and current, seen but not
// owned, unseen, and a thumb row. Links go to the real detail screens.
const linkRows: (RowData & { types: string[] })[] = [
  {
    id: 1,
    number: 1,
    name: "Bulbasaur",
    owned: true,
    href: detailHref(1),
    types: ["Grass", "Poison"],
  },
  {
    id: 4,
    number: 4,
    name: "Charmander",
    owned: true,
    href: detailHref(4),
    types: ["Fire"],
  },
  { id: 7, number: 7, name: "Squirtle", href: detailHref(7), types: ["Water"] },
  {
    id: 10,
    number: 10,
    name: "Caterpie",
    unseen: true,
    href: detailHref(10),
    types: [],
  },
  {
    id: 25,
    number: 25,
    name: "Pikachu",
    thumb: spriteUrl(25),
    href: detailHref(25),
    types: ["Electric"],
  },
];
const buttonRows: RowData[] = [
  { id: 92, number: 92, name: "Gastly", owned: true },
  { id: 93, number: 93, name: "Haunter" },
];

const screens: MenuItem[] = [
  { id: "landing", label: "Landing", href: resolve("/") },
  { id: "login", label: "Log in", href: resolve("/login") },
  { id: "dashboard", label: "Dashboard", href: resolve("/app/dashboard") },
  { id: "search", label: "Search", href: resolve("/app/search") },
  { id: "detail", label: "Detail", href: detailHref(1), hint: "Inverted" },
  { id: "favorites", label: "Favorites", href: resolve("/app/favorites") },
];

const muted = $derived(!inverted);
</script>

<ScreenBody>
  <Header
    title="Design system"
    meta={[{ label: inverted ? "Inverted LCD" : "Standard LCD" }]}
  />

  <Stack>
    <p class="t-body">
      Every component in every state, rendered from the real components on the
      real LCD, so this page cannot drift from the app. The hand-written
      record of what was approved stays in docs/design.
    </p>
    <Menu
      aria-label="Sections"
      items={toc}
      activeIndex={nav.index}
      onactivate={jump}
      oncursor={(i) => (nav.index = i)}
    />
    <Cluster>
      <Button sm href={twinHref}>
        {inverted ? "Standard LCD" : "Inverted LCD"}
      </Button>
    </Cluster>

    <!-- ================================================================ -->
    <Rule />
    <h2 id="palette" tabindex="-1">Palette</h2>
    <p class="t-body">
      The LCD tones are this page. The eighteen type colours are the badge,
      each with its own ink; an unknown type falls back to the light tone.
    </p>
    <State label="TypeBadge, all eighteen and the fallback" {muted}>
      <Types>
        {#each TYPES as type (type)}
          <TypeBadge {type} />
        {/each}
        <TypeBadge type="???" />
      </Types>
    </State>

    <!-- ================================================================ -->
    <Rule />
    <h2 id="type" tabindex="-1">Type</h2>
    <State label="t-label-xs" {muted}><span class="t-label-xs">Hints and captions only</span></State>
    <State label="t-label" {muted}><span class="t-label">The UI voice</span></State>
    <State label="t-label-lg" {muted}><span class="t-label-lg">Screen title</span></State>
    <State label="t-label-xl" {muted}><span class="t-label-xl">Hero</span></State>
    <State label="t-body" {muted}>
      <p class="t-body">
        Jersey 15 at 27px. The only face allowed to run past forty characters,
        so paragraphs and form help use it.
      </p>
    </State>
    <State label="t-display" {muted}><span class="t-display">No.025</span></State>
    <State label="t-display-xl" {muted}><span class="t-display-xl">151</span></State>
    <State label="tones" {muted}>
      <Cluster>
        <span class="t-label t-mid">mid</span>
        <span class="t-label t-red">red</span>
        <span class="t-label t-blue">blue</span>
      </Cluster>
    </State>
    <State label="t-cursor, t-cursor--right" {muted}>
      <Cluster>
        <span class="t-body t-cursor">Continue</span>
        <span class="t-body t-cursor t-cursor--right">Next</span>
      </Cluster>
    </State>

    <!-- ================================================================ -->
    <Rule />
    <h2 id="device" tabindex="-1">Device</h2>
    <p class="t-body">
      The shell around this page is GameBoy; the deck under it follows the
      keyboard. This one is a second Deck: click a button to hold it down.
      The inverted LCD is a shell state, so it has its own page.
    </p>
    <section aria-label="Deck demo">
      <State label="Deck, pressed={demoPressed ?? 'null'}" {muted}>
        <Deck
          pressed={demoPressed}
          onpress={(b) => (demoPressed = demoPressed === b ? null : b)}
        />
      </State>
    </section>

    <!-- ================================================================ -->
    <Rule />
    <h2 id="layout" tabindex="-1">Layout</h2>
    <State label="Stack" {muted}>
      <Stack>
        <Box single><p class="t-body">One</p></Box>
        <Box single><p class="t-body">Two</p></Box>
      </Stack>
    </State>
    <State label="Stack tight" {muted}>
      <Stack tight>
        <Box single><p class="t-body">One</p></Box>
        <Box single><p class="t-body">Two</p></Box>
      </Stack>
    </State>
    <State label="Cluster" {muted}>
      <Cluster>
        <Button sm>A</Button>
        <Button sm>B</Button>
        <TypeBadge type="Grass" />
      </Cluster>
    </State>
    <State label="Split" {muted}>
      <Split>
        <Sprite src={spriteUrl(1)} alt="Bulbasaur" />
        <Stack tight>
          <span class="t-label">Bulbasaur</span>
          <p class="t-body">Stacks beside the well, then under it below 520px.</p>
        </Stack>
      </Split>
    </State>
    <State label="Grid cols=2" {muted}>
      <Grid cols={2}>
        <Card label="Seen" value="17" />
        <Card label="Own" value="9" />
        <Card label="Saved" value="3" />
      </Grid>
    </State>
    <State label="Grid cols=3, identical to cols=2 in components.css" {muted}>
      <Grid cols={3}>
        <Card label="Seen" value="17" />
        <Card label="Own" value="9" />
        <Card label="Saved" value="3" />
      </Grid>
    </State>
    <State label="Rule, Rule dashed" {muted}>
      <div>
        <Rule />
        <Rule dashed />
      </div>
    </State>
    <p class="t-body">ScreenBody is this page: header, body, hints.</p>

    <!-- ================================================================ -->
    <Rule />
    <h2 id="components" tabindex="-1">Components</h2>

    <h3>Box</h3>
    <State label="default" {muted}><Box><p class="t-body">Got a BULBASAUR!</p></Box></State>
    <State label="thick" {muted}><Box thick><p class="t-body">Thick inner rule.</p></Box></State>
    <State label="single" {muted}><Box single><p class="t-body">Single rule, no gap.</p></Box></State>
    <State label="inverted" {muted}><Box inverted><p class="t-body">White on black.</p></Box></State>
    <State label="title" {muted}><Box title="Entry"><p class="t-body">A titled frame.</p></Box></State>
    <State label="flush" {muted}><Box flush><p class="t-body">No padding; content meets the rule.</p></Box></State>
    <State label="inverted, with the buttons it flips" {muted}>
      <Box inverted>
        <ButtonGroup>
          <Button>Neutral</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="danger">Danger</Button>
        </ButtonGroup>
      </Box>
    </State>

    <h3>Header</h3>
    <State label="label then value" {muted}>
      <Header
        level={2}
        title="Pokédex"
        meta={[
          { label: "Seen", value: "151" },
          { label: "Own", value: "097" },
        ]}
      />
    </State>
    <State label="value first" {muted}>
      <Header level={2} title="Favorites" meta={[{ value: "12", label: "saved", valueFirst: true }]} />
    </State>
    <State label="bare label, bare value" {muted}>
      <Header level={2} title="Trainer" meta={[{ label: "ash@pallet.town" }, { value: "025" }]} />
    </State>
    <State label="no meta" {muted}><Header level={2} title="Log in" /></State>

    <h3>Menu</h3>
    <p class="t-body">
      Hover shows the cursor. Focus makes it blink. Disabled swaps it for an X.
      Click or Tab moves these cursors; the D-pad drives the sections menu
      at the top.
    </p>
    <State label="vertical, with a hint and a disabled item" {muted}>
      <Menu
        aria-label="Menu demo"
        items={menuItems}
        activeIndex={menuIndex}
        onactivate={(i) => (menuIndex = i)}
        oncursor={(i) => (menuIndex = i)}
      />
    </State>
    <State label="row" {muted}>
      <Menu
        aria-label="Row menu demo"
        row
        items={rowMenuItems}
        activeIndex={rowMenuIndex}
        onactivate={(i) => (rowMenuIndex = i)}
        oncursor={(i) => (rowMenuIndex = i)}
      />
    </State>

    <h3>Button</h3>
    <p class="t-body">
      Hover inverts. The press is a 2-dot drop onto a hard shadow, drawn by
      :active, so click one. Pressed here means aria-pressed, a toggle.
    </p>
    <State inline label="default" {muted}><Button>Data</Button></State>
    <State inline label="pressed (toggle)" {muted}>
      <Button pressed={togglePressed} onclick={() => (togglePressed = !togglePressed)}>Data</Button>
    </State>
    <State inline label="disabled" {muted}><Button disabled>Data</Button></State>
    <State inline label="loading" {muted}><Button loading>Saving</Button></State>
    <State inline label="primary" {muted}><Button variant="primary">Send link</Button></State>
    <State inline label="primary pressed" {muted}><Button variant="primary" pressed>Send link</Button></State>
    <State inline label="primary disabled" {muted}><Button variant="primary" disabled>Send link</Button></State>
    <State inline label="danger" {muted}><Button variant="danger">Remove</Button></State>
    <State inline label="sm" {muted}><Button sm>Cry</Button></State>
    <State label="block" {muted}><Button block>Next page</Button></State>
    <State inline label="start" {muted}><Button variant="start">Try the demo</Button></State>
    <State inline label="start pressed" {muted}><Button variant="start" pressed>Try the demo</Button></State>
    <State inline label="link (href)" {muted}><Button href={twinHref}>Other LCD</Button></State>
    <State inline label="link disabled: no href" {muted}><Button href={twinHref} disabled>Other LCD</Button></State>
    <State inline label="with an icon, and a toggle with a ball" {muted}>
      <Button><Icon name="search" /> Find</Button>
      <Button variant="primary" pressed={favorite} onclick={() => (favorite = !favorite)}>
        <Ball filled={favorite} /> Favorite
      </Button>
    </State>
    <State label="ButtonGroup" {muted}>
      <ButtonGroup>
        <Button variant="primary">Save</Button>
        <Button>Cancel</Button>
        <span class="t-label-xs t-mid">group</span>
      </ButtonGroup>
    </State>

    <h3>Field</h3>
    <form onsubmit={(event) => event.preventDefault()}>
      <Stack>
        <State label="default, with help" {muted}>
          <Field label="Email" type="email" placeholder="ash@pallet.town" help="We send a one-time link. No password." />
        </State>
        <State label="filled" {muted}>
          <Field label="Email" type="email" bind:value={filled} />
        </State>
        <State label="error" {muted}>
          <Field label="Email" type="email" value="ash@pallet" error="Enter a full address" />
        </State>
        <State label="disabled" {muted}>
          <Field label="Email" type="email" value="ash@pallet.town" disabled />
        </State>
        <State label="search" {muted}>
          <Field search label="Search" placeholder="Name or number" />
        </State>
        <State label="search, hidden label, filled" {muted}>
          <Field search hideLabel label="Search" placeholder="Name or number" bind:value={query} />
        </State>
        <State label="search disabled" {muted}>
          <Field search label="Search" placeholder="Name or number" disabled />
        </State>
      </Stack>
    </form>

    <h3>Row and list</h3>
    <p class="t-body">
      Number, ball if owned, name, dashes if unseen. Rows are links, or
      buttons without an href. Current, hover and focus all invert the row.
    </p>
    <State label="Ball, Ball filled" {muted}>
      <Cluster><Ball /><Ball filled /></Cluster>
    </State>
    <State label="List of links, with badges in the end slot" {muted}>
      <List
        aria-label="Link rows"
        rows={linkRows}
        activeIndex={listIndex}
        onactivate={(i) => (listIndex = i)}
        oncursor={(i) => (listIndex = i)}
      >
        {#snippet end(row)}
          {#each linkRows.find((r) => r.id === row.id)?.types ?? [] as type (type)}
            <TypeBadge {type} />
          {/each}
        {/snippet}
      </List>
    </State>
    <State label="List of buttons" {muted}>
      <List
        aria-label="Button rows"
        rows={buttonRows}
        activeIndex={buttonListIndex}
        onactivate={(i) => (buttonListIndex = i)}
        oncursor={(i) => (buttonListIndex = i)}
      />
    </State>
    <State label="Skeleton, and Skeleton count=3 for rows still loading" {muted}>
      <Skeleton />
      <Skeleton count={3} />
    </State>

    <h3>Sprite well</h3>
    <State label="default, inverted, lg" {muted}>
      <Cluster>
        <Sprite src={spriteUrl(1)} alt="Bulbasaur" />
        <Sprite inverted src={spriteUrl(1)} alt="Bulbasaur" />
        <Sprite lg eager src={spriteUrl(1)} alt="Bulbasaur" />
      </Cluster>
    </State>

    <h3>Stat bar</h3>
    <p class="t-body">
      Green above 50% of max, yellow above 20%, red at or below. The colour
      comes from the same share that draws the width.
    </p>
    <State label="max=100: 80, 45, 12, 0" {muted}>
      <Bars>
        <StatBar label="HP" value={80} max={100} />
        <StatBar label="Atk" name="Attack" value={45} max={100} />
        <StatBar label="Def" name="Defense" value={12} max={100} />
        <StatBar label="None" value={0} max={100} />
      </Bars>
    </State>
    <State label="default max 255: 255, 100" {muted}>
      <Bars>
        <StatBar label="Max" value={255} />
        <StatBar label="SpA" name="Special Attack" value={100} />
      </Bars>
    </State>

    <h3>Tabs</h3>
    <State label="with a panel" {muted}>
      <Tabs tabs={["Data", "Stats", "Moves"]} activeIndex={tab} onactivate={(i) => (tab = i)}>
        {#snippet panel(index)}
          <p class="t-body">Panel {index + 1}: {["Data", "Stats", "Moves"][index]}.</p>
        {/snippet}
      </Tabs>
    </State>
    <State label="without a panel" {muted}>
      <Tabs tabs={["All", "Owned", "Favorites"]} activeIndex={bareTab} onactivate={(i) => (bareTab = i)} />
    </State>

    <h3>Card</h3>
    <State label="plain, link, inverted" {muted}>
      <Grid cols={3}>
        <Card label="Seen" value="151" caption="of 151 in Kanto" />
        <Card label="Favorites" value="12" caption="Link cards press in." href={twinHref} />
        <Card inverted label="Streak" value="07" caption="days in a row" />
      </Grid>
    </State>

    <h3>Notice and toast</h3>
    <State label="tones: none, ok, warn, error, and untitled" {muted}>
      <Stack>
        <Notice title="Info">You can search by name or number. Try 25.</Notice>
        <Notice tone="ok" title="Sent">Check your email. If nothing shows up in a minute, look in spam.</Notice>
        <Notice tone="warn" title="Heads up">Demo mode. Favorites are not saved between visits.</Notice>
        <Notice tone="error" title="Error">Could not reach the server. Try again.</Notice>
        <Notice>No title, just the message.</Notice>
      </Stack>
    </State>
    <State inline label="Toast with ondismiss, at the end of the screen" {muted}>
      <Button sm onclick={() => (toast = true)}>Show toast</Button>
    </State>
    <State label="Toast, static, sticks to the bottom while its parent is in view" {muted}>
      <Stack>
        <Toast>Added Pikachu to favorites</Toast>
      </Stack>
    </State>
    <!-- A toast's negative bottom margin expects the screen's edge; a rule's
         top margin gives it that room here. -->
    <Rule dashed />

    <h3>Hints, key/value, rule</h3>
    <State label="Hints" {muted}>
      <Hints
        hints={[
          { key: "A", label: "Select" },
          { key: "B", label: "Back" },
          { key: "←→", label: "Prev / next" },
          { key: "Start", label: "Menu" },
        ]}
      />
    </State>
    <State label="Kv" {muted}>
      <Kv
        rows={[
          { label: "HT", value: "2'04\"" },
          { label: "WT", value: "15.2 lb" },
          { label: "No.", value: "001" },
        ]}
      />
    </State>
    <State label="Rule, Rule dashed" {muted}>
      <div>
        <Rule />
        <Rule dashed />
      </div>
    </State>

    <h3>Empty and loading</h3>
    <State label="Empty, title only" {muted}><Empty title="No match" /></State>
    <State label="Empty with children" {muted}>
      <Empty title="No favorites yet">
        <p>Open a Pokémon and press A to save it here.</p>
        <Button sm href={resolve("/app/search")}>Browse</Button>
      </Empty>
    </State>
    <State label="Loading" {muted}><Loading /></State>
    <State label="Loading with a label and children" {muted}>
      <Loading label="Fetching">151 entries.</Loading>
    </State>

    <h3>Icon</h3>
    <p class="t-body">
      Sized in hardware dots, so it scales with the device. With a label it
      is an image; without one it is decorative and hidden from AT.
    </p>
    <State label="every icon, labelled" {muted}>
      <Cluster>
        {#each ICONS as name (name)}
          <Icon {name} label={name} />
        {/each}
      </Cluster>
    </State>
    <State label="dots 8, 12, 16, decorative" {muted}>
      <Cluster>
        <Icon name="heart-solid" dots={8} />
        <Icon name="heart-solid" />
        <Icon name="heart-solid" dots={16} />
      </Cluster>
    </State>

    <!-- ================================================================ -->
    <Rule />
    <h2 id="screens" tabindex="-1">Screens</h2>
    <p class="t-body">
      The six screens are the real routes, not copies. Each takes the deck
      when it mounts, so they live at their own addresses.
    </p>
    <Menu aria-label="Screens" items={screens} activeIndex={-1} />
  </Stack>

  <Hints
    hints={[
      { key: "↑↓", label: "Section" },
      { key: "A", label: "Jump" },
      { key: "B", label: "Home" },
    ]}
  />

  {#if toast}
    <Toast ondismiss={() => (toast = false)}>Added Pikachu to favorites</Toast>
  {/if}
</ScreenBody>
