import { execute } from "@/lib/pokemonClient";
import {
  POKEMON_AGGREGATES,
  POKEMON_ID_PAGE_QUERY,
  SAMPLE_POKEMON_TYPES,
  SEARCH_POKEMON,
  TOP_POKEMON_BY_BASE_EXPERIENCE,
} from "@/lib/queries";
import type {
  PokemonAggregatesQuery,
  PokemonAggregatesQueryVariables,
  SamplePokemonTypesQuery,
  SamplePokemonTypesQueryVariables,
  TopPokemonByBaseExperienceQuery,
  TopPokemonByBaseExperienceQueryVariables,
} from "@/src/graphql/graphql";
import type { Pokemon } from "@/types/pokemon";

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

export { getPokemonById, getSearchPokemon };

// Dashboard services
export const getPokemonAggregates = async () => {
  const response = await execute<
    PokemonAggregatesQuery,
    PokemonAggregatesQueryVariables
  >(POKEMON_AGGREGATES);
  const agg = response.data.pokemon_aggregate.aggregate;
  return {
    total: agg?.count ?? 0,
    avgBaseExperience: agg?.avg?.base_experience ?? 0,
  } as { total: number; avgBaseExperience: number };
};

export const getTopPokemonByBaseExperience = async (limit: number) => {
  const response = await execute<
    TopPokemonByBaseExperienceQuery,
    TopPokemonByBaseExperienceQueryVariables
  >(TOP_POKEMON_BY_BASE_EXPERIENCE, { limit });
  const list = response.data.pokemon.map((p) => ({
    id: p.id,
    name: p.name,
    baseExperience: p.base_experience ?? 0,
    spriteUrl: p.pokemonsprites[0]?.sprites?.front_default ?? "",
    types: p.pokemontypes.map((t) => ({
      name: t.type?.name ?? "",
      awesomeName: t.type?.typenames[0]?.name ?? "",
    })),
  }));
  return list as Array<{
    id: number;
    name: string;
    baseExperience: number;
    spriteUrl: string;
    types: { name: string; awesomeName: string }[];
  }>;
};

export const getTypeDistribution = async (sampleSize: number) => {
  const response = await execute<
    SamplePokemonTypesQuery,
    SamplePokemonTypesQueryVariables
  >(SAMPLE_POKEMON_TYPES, { limit: sampleSize });
  const counts = new Map<string, { name: string; count: number }>();
  response.data.pokemon.forEach((p) => {
    p.pokemontypes.forEach((t) => {
      const key = t.type?.name ?? "unknown";
      const label = t.type?.typenames[0]?.name ?? key;
      const prev = counts.get(key) || { name: label, count: 0 };
      counts.set(key, { name: label, count: prev.count + 1 });
    });
  });
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
};
