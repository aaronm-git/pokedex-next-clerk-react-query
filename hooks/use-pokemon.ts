import { execute } from "@/lib/pokemonClient";
import { POKEMON_ID_PAGE_QUERY, SEARCH_POKEMON } from "@/lib/queries";
import type { Pokemon } from "@/types/pokemon";

export const usePokemon = () => {
  return {
    getPokemonById,
    getSearchPokemon,
  };
};

const getPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await execute(POKEMON_ID_PAGE_QUERY, { id });
  const pokemonData = response.data.pokemon[0];

  if (!pokemonData) {
    throw new Error("Pokemon not found");
  }

  const pokemon: Pokemon = {
    id: pokemonData.id ?? 0,
    name: pokemonData.name ?? "",
    awesomeName: pokemonData.name ?? "", // This needs to draw from the GraphQL API
    cryUrl: pokemonData.pokemoncries[0]?.cries?.latest ?? "",
    spriteUrl: pokemonData.pokemonsprites[0]?.sprites?.front_default ?? "",
    baseExperience: pokemonData.base_experience ?? 0,
    stats: pokemonData.pokemonstats.map((stat) => ({
      name: stat.stat?.name ?? "",
      awesomeName: stat.stat?.statnames[0].name ?? "",
      baseStat: stat.base_stat ?? 0,
    })),
    moves: pokemonData.pokemonmoves.map((move) => ({
      name: move.move?.name ?? "",
      awesomeName: move.move?.movenames[0].name ?? "",
      pokemonIds: [],
    })),
    abilities: pokemonData.pokemonabilities.map((ability) => ({
      name: ability.ability?.name ?? "",
      awesomeName: ability.ability?.abilitynames[0].name ?? "",
    })),
    types: pokemonData.pokemontypes.map((type) => ({
      name: type.type?.name ?? "",
      awesomeName: type.type?.typenames[0].name ?? "",
    })),
  };

  return pokemon;
};

const getSearchPokemon = async (searchTerm: string, page: number) => {
  const response = await execute(SEARCH_POKEMON, {
    searchTerm: `%${searchTerm}%`,
    page,
  });
  const pokemonData = response.data.pokemon_aggregate;
  const results: {
    total: number;
    pokemon: {
      id: number;
      name: string;
      spriteUrl: string;
      type: string;
    }[];
  } = {
    total: response.data.pokemon_aggregate.aggregate?.count ?? 0,
    pokemon: pokemonData.nodes.map((pkmn) => ({
      id: pkmn.id,
      name: pkmn.name,
      spriteUrl: pkmn.pokemonsprites[0].sprites.front_default,
      type: pkmn.pokemontypes[0].type?.typenames[0]?.name ?? "",
    })),
  };
  return results;
};
