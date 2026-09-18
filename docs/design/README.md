# Pokédex design: research and rationale

The brief was a Pokédex that looks and feels like it runs on a Game Boy Color. Not a modern app with a retro accent. This document is what I looked at, what I took from it, what I rejected, and why. The rendered system is in [style-guide.html](./style-guide.html). The production CSS is in `src/lib/styles/`.

## The short version

The app is a Berry-red Game Boy Color sitting on a dark desk. The whole UI lives on its LCD. The D-pad, A, B, START and SELECT are real buttons the app binds to navigation. The LCD is light gray-green, not white, because the CGB's brightest value never read as white. Type is Press Start 2P for anything that would have been an 8x8 tile in 1999 and Jersey 15 for paragraphs. Everything on the device is a whole number of "dots" (2px, or 3px on big monitors). No corner radius on the LCD. No blur. No easing. The device does not stretch to fill a monitor, because a Game Boy does not do that either.

## What I looked at

### The hardware

The GBC launched in late 1998 with a 2.3-inch reflective TFT, 160x144 pixels, 10:9, in a 133.5 x 78 mm shell. Launch shells: Berry, Grape, Kiwi, Dandelion, Teal, Atomic Purple. D-pad left, A and B on the right slanted up, START and SELECT as rubber pills angled below, a speaker grille bottom right, and a bezel that is square at the top with one large radius at the bottom right. ([Wikipedia](https://en.wikipedia.org/wiki/Game_Boy_Color), [Game Boy wiki color list](https://gameboy.fandom.com/wiki/List_of_Game_Boy_System_Colors_and_Variations))

What I took: Berry as the shell. It is the launch red, and it is also Pokédex red, which is the one coincidence this project needed. The asymmetric bezel radius. The purple A/B buttons. The bottom-right grille. The wordmark strip above the bezel with a power LED.

What I rejected: the 25-degree rotation on START and SELECT. Rotated pixel text is the one thing a pixel grid cannot do, and the labels would blur. The pills sit level.

### The screen

The PPU draws 8x8 tiles on a 32x32 tile map with a 20x18 tile window visible. Color is 15-bit RGB555: 5 bits per channel, 0..31. Eight background palettes of four colors, eight sprite palettes of three plus transparent. ([Copetti](https://www.copetti.org/writings/consoles/game-boy/), [Pan Docs palettes](https://gbdev.io/pandocs/Palettes.html))

The panel itself is the part people misremember. Pan Docs is blunt about it: the highest intensity "will produce light gray rather than white", colors are not perfectly saturated, and $03EF, which is neon green on a monitor, comes out "a decently washed out yellow" on the real LCD. Emulators model this. SameBoy's "reduce contrast" mode applies a 1.6 gamma, mixes 1/16 of the other channels into each channel, and then adds a flat brightness offset. GB Studio Central says the same in plainer words: less saturated, a hint of cyan in the greens, and it changes with the room light. ([GB Studio Central](https://gbstudiocentral.com/tips/color-reproduction-on-gbc-and-emulators/), [SameBoy display.c](https://github.com/LIJI32/SameBoy/blob/master/Core/display.c))

The decision: idealized colors, honest panel. I did not reproduce the washed-out LCD across the UI, because the washed look is a memory of squinting, and a hiring manager squinting at a portfolio is the failure mode the brief named. But I did take the one thing every emulator agrees on: white is not white. The LCD paper is #E7EFDE, a light gray-green. Ink is #101821, a near-black that the real panel would render as dark gray. And every color in the system is RGB555-representable: I picked each channel on the 0..31 grid and expanded it the way the hardware does, `(v << 3) | (v >> 2)`, which is why the hex values look odd. So the palette is one a GBC could actually show, without the muddiness of how it showed it.

### The in-game Pokédex

I read the layout straight from the disassemblies rather than from screenshots.

Gen 1 (pokered, `engine/menus/pokedex.asm`): the list draws 7 rows starting at tile (1,3), each row is number, a Poké Ball if owned, then the name or a dashed line if unseen. A vertical divider at column 14. SEEN at (16,2) with the count under it, OWN at (16,5), a dashed horizontal rule at row 8, then DATA / CRY / AREA / QUIT under it. The entry page puts the sprite at (1,1), the name at (9,2), species at (9,4), HT/WT at (9,6), the number at (2,8), a horizontal line across row 9, and the description from row 11 down. The frame is a single-line box built from corner and edge tiles. ([pret/pokered](https://github.com/pret/pokered/blob/master/engine/menus/pokedex.asm))

Gen 2 (pokecrystal, `engine/pokedex/pokedex.asm`): still 7 rows, a cursor arrow, SELECT and START hints at the bottom row, and the entry page split into a sprite box on the left, number / name / species / height / weight on the right, footprint below, and a description box under all of it with PAGE / AREA / CRY / PRNT along the bottom. Crystal's dex is drawn white on black, the inverse of every other menu in the game. ([pret/pokecrystal](https://github.com/pret/pokecrystal/blob/master/engine/pokedex/pokedex.asm), [Bulbapedia on Crystal](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Crystal_Version))

What I took: the row grammar (number, ball, name, dashes for unseen) is the list component almost verbatim. SEEN / OWN counters in the header. The cursor arrow on menus. A hint strip along the bottom that names what A, B and START do on this screen. The double-rule text box from the Gen 1 dialogue system. The entry layout with the sprite well on the left and the number / species / HT / WT stack on the right, a rule, then the description. And Crystal's inversion: the detail view is white on black, so it reads as the one special screen, the same way it did in 2000.

What I rejected: the single-line entry frame from Gen 1. The double rule from the dialogue boxes is the more recognizable one and it does double duty as a focus and grouping device. Also the footprint. It is a lovely detail but the data source does not have it.

### The Tiger Electronics toy

The 1998 Tiger Pokédex is a red clamshell with a segment LCD and a blue lens on the lid. I looked at it because the brief mentioned it, and I decided not to use it. It is the anime's device, not the Game Boy's, and mixing the two would give me a shell nobody owned. The one thing it confirmed is that red is the Pokédex color, which sealed Berry. ([Pokémon wiki, Pokédex toys](https://pokemon.fandom.com/wiki/Pok%C3%A9dex_toys))

### The fonts

The project loads Press Start 2P and Jersey 15 Charted. I pulled all three relevant TTFs from Google Fonts and read their metrics with fontTools rather than trust the specimen pages.

Press Start 2P: 1000 units per em, cap height 1000, monospace advance 1000, glyphs on an 8x8 grid. So one glyph pixel is 1/8 em and the face is only crisp at multiples of 8px. This matches the designer's note that it "works best at sizes of 8px, 16px and other multiples of 8." It descends from Namco's 1980s arcade font, which is the right era and the right register for a UI voice. ([Google Fonts description](https://github.com/google/fonts/blob/main/ofl/pressstart2p/DESCRIPTION.en_us.html))

Jersey 15: 1350 units per em, cap height 750, x-height 550, advance 600 for both H and n. The number in the name is the cap height in pixels, so one glyph pixel is 50 units, or 1/27 em. Crisp sizes are 27px, 54px, 81px. At 27px you get a 15px cap and an 11px x-height, which is about the size of 21px Helvetica, and it is condensed, so a 44-character line fits in about 300px. That is the body face. ([soft-type-jersey README](https://github.com/scfried/soft-type-jersey))

Jersey 15 Charted is out. This is the one place I am overriding the brief, and the reason is mechanical. A Charted glyph is a single filled contour that covers the whole em box, with 46-unit square holes on a 50-unit grid; the glyph's "on" pixels are the cells that are not holes. The chart is the 4-unit grid lines between holes. At 27px a grid line is 0.08px wide. The browser cannot draw that, so it antialiases it into a faint gray wash across the entire glyph box, including the spaces between letters. You get no dot-matrix texture, you lose contrast, and the Charted "H" has 196 contours where the plain "H" has one, which is a rendering cost for nothing. The style guide shows both faces at 324px, where the grid finally becomes 1px lines and you can see what Charted is for: knitting charts. Jersey 15 does everything I wanted Charted to do, at every size, and it is one more Google Fonts request, so the swap is a one-line change in the layout.

## Decisions

### The device is the app

One `.gb-device` wraps everything. The LCD is a scrolling window; screens render inside it; the deck below is real buttons. On desktop it sits at a fixed size on a dark desk with a tile grid. On phones the shell goes edge to edge and the screen takes the viewport height minus the deck. The Game Boy was already a vertical handheld. The phone layout is the one that needs the least argument, and it is the one a hiring manager will open first.

### Two pixel grids, on purpose

The hardware pixel is `--dot`: 2px by default, 3px at 1280x800 and up. Every border, button, shadow, spacing token and Press Start 2P size is a whole number of dots. The Jersey pixel is `--jpx`: 1px, and body copy is 27px at every scale. Two grids because the two faces have different unit sizes and forcing one onto the other's scale would put one of them on half pixels. At dot 3 the device grows 1.5x and body copy stays 27px; the label face grows to a 24px cap next to Jersey's 15px cap, which reads as heading over body, the ratio you want. A `data-dot="4"` escape hatch doubles both grids for a giant mode the app can hang off SELECT.

### The screen is 22 tiles, not 20

The real screen is 20 tiles wide. I use 22. A Gen 1 row is number (3 chars), ball (1), name (10) plus a gap, and I want a type swatch on the end, which does not fit in 20 tiles of 16px Press Start 2P. Twenty-two tiles is 352px at dot 2, which fits a 360px phone with the shell padding. On that width, list rows collapse the type badge to a one-tile colored square via a container query, because a 10-character name needs its room and Gen 1 never put a badge in the list either. Full badges show in the detail view.

### No radius, no blur, no easing

The tile grid has no curves, so nothing on the LCD has a border radius. The only curves are on the molded shell, which is plastic and allowed to bend. Shadows are hard 2-dot offsets, because blur is a modern GPU announcing itself. Motion is `steps()`: a button drops 2 dots in one frame, a bar fills in four, the continue arrow blinks at 533ms, which is roughly the 32-frame cadence in the games. `prefers-reduced-motion` sets every duration to 0 and freezes the blink on its visible frame.

### The START button

The "try the demo" call to action is a rubber pill drawn on the LCD, with the START label pressed into it, a 3-dot travel and a blinking arrow. It is the one element that borrows the deck's material for the screen, and it is only allowed once per screen for that reason.

### Contrast

Every text and background pair in the system was checked, not eyeballed. Ink on paper is 14.2:1. Mid on paper is 5.99:1, and mid is the only secondary text color. Light is 1.66:1 and is never used for text, only rules and disabled fills. Each of the 18 type colors has its ink picked by the ratio: six use white, twelve use black, all clear 4.5:1. The signal colors follow the same rule (white on red and blue, black on yellow and green). 8px Press Start 2P exists in the system for hints and captions only, never for a sentence or a control; tabs, which started at 8px, moved to Jersey 27px once I saw them.

## Component inventory

Device chrome (`device.css`): `gb-stage`, `gb-device`, `gb-device__top`, `gb-led`, `gb-wordmark`, `gb-bezel`, `gb-bezel__label`, `gb-screen` (`--inverted`, `--matrix`, `--boot`), `gb-deck`, `gb-dpad` with four `gb-dpad__btn` arms, `gb-ab` with `gb-ab__btn`, `gb-pills` with `gb-pill__btn`, `gb-device__grille`.

LCD components (`components.css`): `dex-box` (`--thick`, `--single`, `--inverted`, `__title`), `dex-header` with `__meta`, `dex-menu` with cursor states (`--row`), `dex-btn` (`--primary`, `--danger`, `--start`, `--sm`, `--block`; hover, pressed, focus, disabled, loading), `dex-btn-group`, `dex-field` (`__label`, `__input`, `__help`, `__error`, `--search`), `dex-list` and `dex-row` (`--unseen`, `--thumb`), `dex-ball`, `dex-sprite` (`--lg`, `--inverted`), `dex-bar` with `data-level`, `dex-type[data-type]`, `dex-tabs`, `dex-card` (`--inverted`, `--link`), `dex-notice` (`--ok`, `--warn`, `--error`), `dex-toast`, `dex-hints`, `dex-kv`, `dex-rule`, `dex-empty`, `dex-loading`, `dex-skeleton`, layout helpers `dex-grid`, `dex-stack`, `dex-cluster`, `dex-split`, `dex-screen-body`.

Type (`type.css`): `t-label` in xs / default / lg / xl, `t-body`, `t-display` and `t-display-xl`, tone modifiers, the `t-cursor` continue arrow.

## Files

- `src/lib/styles/index.css` imports the rest in order. The SvelteKit root layout imports this one file.
- `src/lib/styles/tokens.css` is every custom property: the two grids, spacing, LCD and shell palettes, 18 type colors with their inks, type scale, borders, shadows, motion, layout sizes, the dot-3 breakpoint and the reduced-motion override.
- `src/lib/styles/base.css` is the reset, font import, pixelated image rendering, focus outline and LCD scrollbar.
- `src/lib/styles/type.css`, `device.css`, `components.css` as above.
- `docs/design/style-guide.html` and `style-guide.css` render all of it. The guide imports the lib CSS by relative path so it can never drift from the app. Open it from a static server; the fonts and sprites come from Google Fonts and PokeAPI.

## What to change when this moves into Svelte

Each `dex-*` block maps to one component with a scoped `<style>`. Tokens stay global. The device chrome becomes the root layout. Bind the deck: D-pad up/down moves `aria-current` through lists and menus, left/right pages through entries, A activates, B goes back, START opens the menu or the demo, SELECT cycles `data-dot`. Swap the layout's `Jersey_15_Charted` import for `Jersey_15`.
