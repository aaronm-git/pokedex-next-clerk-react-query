import { graphql } from "@/src/graphql";

export const POKEMON_ID_PAGE_QUERY = graphql(`
  query SearchPokemonById($id: Int!) {
  pokemon(where: {_and: [{id: {_eq: $id}, is_default: {_eq: true}}]}) {
    id
    name
    weight
    height
    base_experience
    pokemonsprites {
      sprites
    }
    pokemonstats {
      base_stat
      stat {
        name
        statnames(where: {language_id: {_eq: 9}}) {
          language {
            id
          }
          name
        }
      }
    }
    pokemonmoves {
      move {
        name
        movenames(where: {language_id: {_eq: 9}}) {
          name
        }
      }
    }
    pokemoncries {
      cries
    }
    pokemonabilities {
      ability {
        name
        abilitynames(where: {language_id: {_eq: 9}}) {
          name
        }
        generation {
          generationnames_aggregate(where: {language_id: {_eq: 9}}) {
            nodes {
              name
            }
          }
        }
        abilityeffecttexts_aggregate(where: {language_id: {_eq: 9}}) {
          nodes {
            short_effect
            effect
          }
        }
      }
    }
    pokemontypes {
      type {
        name
        typenames(where: {language_id: {_eq: 9}}) {
          name
        }
      }
    }
  }
}
`);

export const SEARCH_POKEMON = graphql(`
query SearchPokemon($searchTerm: String!, $page: Int!) {
  pokemon_aggregate(
    where: {_and: [{name: {_ilike: $searchTerm}}, {is_default: {_eq: true}}]}
    limit: 10
    offset: $page
    order_by: {id: asc}
  ) {
    aggregate {
      count
    }
    nodes {
      id
      name
      pokemonsprites {
        sprites
      }
      pokemontypes {
        type {
          name
          typenames(where: {language_id: {_eq: 9}}) {
            name
          }
        }
      }
    }
  }
}
`);

// Dashboard aggregates for pokemon
export const POKEMON_AGGREGATES = graphql(`
  query PokemonAggregates {
    pokemon_aggregate(where: {is_default: {_eq: true}}) {
      aggregate {
        count
        avg {
          base_experience
        }
      }
    }
  }
`);

// Top Pokemon by base experience
export const TOP_POKEMON_BY_BASE_EXPERIENCE = graphql(`
  query TopPokemonByBaseExperience($limit: Int!) {
    pokemon(
      where: {is_default: {_eq: true}}
      order_by: {base_experience: desc}
      limit: $limit
    ) {
      id
      name
      base_experience
      pokemonsprites { sprites }
      pokemontypes {
        type {
          name
          typenames(where: {language_id: {_eq: 9}}) { name }
        }
      }
    }
  }
`);

// Sample a set of Pokémon to compute type distribution client-side
export const SAMPLE_POKEMON_TYPES = graphql(`
  query SamplePokemonTypes($limit: Int!) {
    pokemon(
      where: { is_default: { _eq: true } }
      limit: $limit
      order_by: { id: asc }
    ) {
      id
      pokemontypes {
        type {
          name
          typenames(where: { language_id: { _eq: 9 } }) { name }
        }
      }
    }
  }
`);
