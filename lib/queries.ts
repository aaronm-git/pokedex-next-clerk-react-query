import { graphql } from "@/src/graphql";

// Get all Pokémon with basic info
export const GET_ALL_POKEMON = graphql(`
  query GetAllPokemon($limit: Int = 20, $offset: Int = 0) {
    pokemonspecies(limit: $limit, offset: $offset, order_by: { id: asc }) {
      id
      name
      pokemon_color_id
      generation {
        id
        name
      }
    }
  }
`);

// Get a specific Pokémon by name
export const GET_POKEMON_BY_NAME = graphql(`
  query GetPokemonByName($name: String!) {
    pokemonspecies(where: { name: { _eq: $name } }) {
      id
      name
      generation {
        id
        name
      }
    }
  }
`);

// Search Pokémon by name pattern
export const SEARCH_POKEMON = graphql(`
  query SearchPokemon($searchTerm: String!) {
    pokemonspecies(
      where: { name: { _ilike: $searchTerm } }
      limit: 10
      order_by: { id: asc }
    ) {
      id
      name
      generation {
        id
        name
      }
    }
  }
`);

export const GET_POKEMON_SPRITES = graphql(`
  query GetPokemonSpritesByIds($ids: [Int!]) {
    pokemonformsprites(where: { id: { _in: $ids } }) {
      id
      pokemon_form_id
      sprites
    }
  }
`);
