export const POKEMON_TYPE_COLORS = {
  normal: "#A8A878",
  poison: "#A040A0",
  psychic: "#F85888",
  grass: "#78C850",
  ground: "#E0C068",
  ice: "#98D8D8",
  fire: "#F08030",
  rock: "#B8A038",
  dragon: "#7038F8",
  water: "#6890F0",
  bug: "#A8B820",
  dark: "#705848",
  fighting: "#C03028",
  ghost: "#705898",
  steel: "#B8B8D0",
  flying: "#A890F0",
  electric: "#F8D030",
  fairy: "#EE99AC",
  unknown: "#ffffff",
} as const;

export type PokemonType = keyof typeof POKEMON_TYPE_COLORS;
