// Static Kanto entries for phase 2. Phase 3 replaces the data with PokeAPI
// and keeps the shape, so the shape follows PokeAPI's units: height in
// decimetres, weight in hectograms, the six base stats by their API names.
// Formatting for the screen lives in $lib/pokemon/format.

export const KANTO_COUNT = 151;

export type PokemonType =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Dark"
  | "Steel"
  | "Fairy";

export type BaseStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type Pokemon = {
  /** National dex number, 1..151 for Kanto. */
  id: number;
  name: string;
  /** The "Seed Pokémon" line under the name. */
  species: string;
  types: PokemonType[];
  sprite: string;
  /** Decimetres, as PokeAPI reports it. */
  height: number;
  /** Hectograms, as PokeAPI reports it. */
  weight: number;
  stats: BaseStats;
  /** Red/Blue flavour text. */
  description: string;
  /** A few level-up moves, enough to fill a tab. */
  moves: string[];
  /** Every id in this Pokémon's evolution line, in order, itself included. */
  evolution: number[];
};

const SPRITES =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export function spriteUrl(id: number): string {
  return `${SPRITES}/${id}.png`;
}

type Seed = Omit<Pokemon, "sprite" | "stats"> & {
  stats: [number, number, number, number, number, number];
};

function entry({ stats, ...rest }: Seed): Pokemon {
  const [hp, attack, defense, specialAttack, specialDefense, speed] = stats;
  return {
    ...rest,
    sprite: spriteUrl(rest.id),
    stats: { hp, attack, defense, specialAttack, specialDefense, speed },
  };
}

// Whole evolution lines, so the detail screen's Evolution tab links to
// entries that exist. Seventeen entries: enough for a list, a grid, a
// search that narrows, and an empty state.
export const POKEMON: Pokemon[] = [
  entry({
    id: 1,
    name: "Bulbasaur",
    species: "Seed Pokémon",
    types: ["Grass", "Poison"],
    height: 7,
    weight: 69,
    stats: [45, 49, 49, 65, 65, 45],
    description:
      "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
    moves: ["Tackle", "Growl", "Leech Seed", "Vine Whip"],
    evolution: [1, 2, 3],
  }),
  entry({
    id: 2,
    name: "Ivysaur",
    species: "Seed Pokémon",
    types: ["Grass", "Poison"],
    height: 10,
    weight: 130,
    stats: [60, 62, 63, 80, 80, 60],
    description:
      "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.",
    moves: ["Tackle", "Growl", "Leech Seed", "Razor Leaf"],
    evolution: [1, 2, 3],
  }),
  entry({
    id: 3,
    name: "Venusaur",
    species: "Seed Pokémon",
    types: ["Grass", "Poison"],
    height: 20,
    weight: 1000,
    stats: [80, 82, 83, 100, 100, 80],
    description:
      "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.",
    moves: ["Tackle", "Growl", "Razor Leaf", "Solar Beam"],
    evolution: [1, 2, 3],
  }),
  entry({
    id: 4,
    name: "Charmander",
    species: "Lizard Pokémon",
    types: ["Fire"],
    height: 6,
    weight: 85,
    stats: [39, 52, 43, 60, 50, 65],
    description:
      "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",
    moves: ["Scratch", "Growl", "Ember", "Slash"],
    evolution: [4, 5, 6],
  }),
  entry({
    id: 5,
    name: "Charmeleon",
    species: "Flame Pokémon",
    types: ["Fire"],
    height: 11,
    weight: 190,
    stats: [58, 64, 58, 80, 65, 80],
    description:
      "When it swings its burning tail, it elevates the temperature to unbearably high levels.",
    moves: ["Scratch", "Growl", "Ember", "Flamethrower"],
    evolution: [4, 5, 6],
  }),
  entry({
    id: 6,
    name: "Charizard",
    species: "Flame Pokémon",
    types: ["Fire", "Flying"],
    height: 17,
    weight: 905,
    stats: [78, 84, 78, 109, 85, 100],
    description:
      "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.",
    moves: ["Scratch", "Ember", "Slash", "Fire Spin"],
    evolution: [4, 5, 6],
  }),
  entry({
    id: 7,
    name: "Squirtle",
    species: "Tiny Turtle Pokémon",
    types: ["Water"],
    height: 5,
    weight: 90,
    stats: [44, 48, 65, 50, 64, 43],
    description:
      "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
    moves: ["Tackle", "Tail Whip", "Bubble", "Water Gun"],
    evolution: [7, 8, 9],
  }),
  entry({
    id: 8,
    name: "Wartortle",
    species: "Turtle Pokémon",
    types: ["Water"],
    height: 10,
    weight: 225,
    stats: [59, 63, 80, 65, 80, 58],
    description:
      "Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance.",
    moves: ["Tackle", "Tail Whip", "Bubble", "Bite"],
    evolution: [7, 8, 9],
  }),
  entry({
    id: 9,
    name: "Blastoise",
    species: "Shellfish Pokémon",
    types: ["Water"],
    height: 16,
    weight: 855,
    stats: [79, 83, 100, 85, 105, 78],
    description:
      "A brutal Pokémon with pressurized water jets on its shell. They are used for high speed tackles.",
    moves: ["Tackle", "Bite", "Skull Bash", "Hydro Pump"],
    evolution: [7, 8, 9],
  }),
  entry({
    id: 25,
    name: "Pikachu",
    species: "Mouse Pokémon",
    types: ["Electric"],
    height: 4,
    weight: 60,
    stats: [35, 55, 40, 50, 50, 90],
    description:
      "When several of these Pokémon gather, their electricity could build and cause lightning storms.",
    moves: ["Thunder Shock", "Growl", "Quick Attack", "Thunderbolt"],
    evolution: [25, 26],
  }),
  entry({
    id: 26,
    name: "Raichu",
    species: "Mouse Pokémon",
    types: ["Electric"],
    height: 8,
    weight: 300,
    stats: [60, 90, 55, 90, 80, 110],
    description:
      "Its long tail serves as a ground to protect itself from its own high voltage power.",
    moves: ["Thunder Shock", "Growl", "Thunder Wave", "Thunder"],
    evolution: [25, 26],
  }),
  entry({
    id: 92,
    name: "Gastly",
    species: "Gas Pokémon",
    types: ["Ghost", "Poison"],
    height: 13,
    weight: 1,
    stats: [30, 35, 30, 100, 35, 80],
    description:
      "Almost invisible, this gaseous Pokémon cloaks the target and puts it to sleep without notice.",
    moves: ["Lick", "Confuse Ray", "Night Shade", "Hypnosis"],
    evolution: [92, 93, 94],
  }),
  entry({
    id: 93,
    name: "Haunter",
    species: "Gas Pokémon",
    types: ["Ghost", "Poison"],
    height: 16,
    weight: 1,
    stats: [45, 50, 45, 115, 55, 95],
    description:
      "Because of its ability to slip through block walls, it is said to be from another dimension.",
    moves: ["Lick", "Confuse Ray", "Night Shade", "Dream Eater"],
    evolution: [92, 93, 94],
  }),
  entry({
    id: 94,
    name: "Gengar",
    species: "Shadow Pokémon",
    types: ["Ghost", "Poison"],
    height: 15,
    weight: 405,
    stats: [60, 65, 60, 130, 75, 110],
    description:
      "Under a full moon, this Pokémon likes to mimic the shadows of people and laugh at their fright.",
    moves: ["Lick", "Confuse Ray", "Night Shade", "Dream Eater"],
    evolution: [92, 93, 94],
  }),
  entry({
    id: 143,
    name: "Snorlax",
    species: "Sleeping Pokémon",
    types: ["Normal"],
    height: 21,
    weight: 4600,
    stats: [160, 110, 65, 65, 110, 30],
    description:
      "Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful.",
    moves: ["Headbutt", "Amnesia", "Rest", "Body Slam"],
    evolution: [143],
  }),
  entry({
    id: 150,
    name: "Mewtwo",
    species: "Genetic Pokémon",
    types: ["Psychic"],
    height: 20,
    weight: 1220,
    stats: [106, 110, 90, 154, 90, 130],
    description:
      "It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.",
    moves: ["Confusion", "Psychic", "Barrier", "Recover"],
    evolution: [150],
  }),
  entry({
    id: 151,
    name: "Mew",
    species: "New Species Pokémon",
    types: ["Psychic"],
    height: 4,
    weight: 40,
    stats: [100, 100, 100, 100, 100, 100],
    description:
      "So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.",
    moves: ["Pound", "Transform", "Mega Punch", "Psychic"],
    evolution: [151],
  }),
];

export function findPokemon(id: number): Pokemon | undefined {
  return POKEMON.find((p) => p.id === id);
}
