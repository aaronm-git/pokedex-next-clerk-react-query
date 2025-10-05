import { graphql } from "@/src/graphql";

export const POKEMON_ID_PAGE_QUERY = graphql(`
  query SearchPokemonById($id: Int!) {
  pokemon(where: {id: {_eq: $id}}) {
    name
    base_experience
    pokemonstats {
      stat {
        name
        characteristics_aggregate {
          nodes {
            characteristicdescriptions_aggregate(where: {language: {name: {_eq: "en"}}}) {
              nodes {
                description
              }
            }
          }
        }
      }
      base_stat
    }
    pokemonmoves {
      move {
        name
      }
    }
    pokemoncries {
      cries
    }
    pokemonabilities {
      ability {
        name
      }
    }
    pokemonsprites {
      sprites
    }
    pokemontypes {
      type {
        name
      }
    }
  }
}
`);

export const SEARCH_POKEMON = graphql(`
  query SearchPokemon($searchTerm: String!) {
    pokemon(
      where: { name: { _ilike: $searchTerm } }
      limit: 10
      order_by: { id: asc }
    ) {
      id
      name
      pokemoncries {
        cries
      }
      pokemonsprites {
        sprites
      }
    }
  }
`);
