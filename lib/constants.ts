export const POKEMON_TYPE_COLORS = {
  grass: "#49da2f",
  fire: "#ff0000",
  water: "#002aff",
  electric: "#fffb00",
  psychic: "#6a38ff",
  ice: "#68d9ff",
  dark: "#2a2a2a",
  dragon: "#541b8a",
  fairy: "#ffa7d4",
  fighting: "#ff5c2a",
  flying: "#2990ff",
  ghost: "#641468",
  ground: "#944309",
  normal: "#ededed",
  poison: "#fe2df7",
  rock: "#c5a697",
  steel: "#6b84a6",
  unknown: "#ffffff",
  shadow: "#453f46",
} as const;

export type PokemonType = keyof typeof POKEMON_TYPE_COLORS;
