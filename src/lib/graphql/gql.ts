/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query SearchPokemonById($id: Int!) {\n  pokemon(where: {_and: [{id: {_eq: $id}, is_default: {_eq: true}}]}) {\n    id\n    name\n    weight\n    height\n    base_experience\n    pokemonsprites {\n      sprites\n    }\n    pokemonstats {\n      base_stat\n      stat {\n        name\n        statnames(where: {language_id: {_eq: 9}}) {\n          language {\n            id\n          }\n          name\n        }\n      }\n    }\n    pokemonmoves {\n      move {\n        name\n        movenames(where: {language_id: {_eq: 9}}) {\n          name\n        }\n      }\n    }\n    pokemoncries {\n      cries\n    }\n    pokemonabilities {\n      ability {\n        name\n        abilitynames(where: {language_id: {_eq: 9}}) {\n          name\n        }\n        generation {\n          generationnames_aggregate(where: {language_id: {_eq: 9}}) {\n            nodes {\n              name\n            }\n          }\n        }\n        abilityeffecttexts_aggregate(where: {language_id: {_eq: 9}}) {\n          nodes {\n            short_effect\n            effect\n          }\n        }\n      }\n    }\n    pokemontypes {\n      type {\n        name\n        typenames(where: {language_id: {_eq: 9}}) {\n          name\n        }\n      }\n    }\n  }\n}\n": typeof types.SearchPokemonByIdDocument,
    "\nquery SearchPokemon($searchTerm: String!, $page: Int!) {\n  pokemon_aggregate(\n    where: {_and: [{name: {_ilike: $searchTerm}}, {is_default: {_eq: true}}]}\n    limit: 10\n    offset: $page\n    order_by: {id: asc}\n  ) {\n    aggregate {\n      count\n    }\n    nodes {\n      id\n      name\n      pokemonsprites {\n        sprites\n      }\n      pokemontypes {\n        type {\n          name\n          typenames(where: {language_id: {_eq: 9}}) {\n            name\n          }\n        }\n      }\n    }\n  }\n}\n": typeof types.SearchPokemonDocument,
    "\n  query PokemonAggregates {\n    pokemon_aggregate(where: {is_default: {_eq: true}}) {\n      aggregate {\n        count\n        avg {\n          base_experience\n        }\n      }\n    }\n  }\n": typeof types.PokemonAggregatesDocument,
    "\n  query TopPokemonByBaseExperience($limit: Int!) {\n    pokemon(\n      where: {is_default: {_eq: true}}\n      order_by: {base_experience: desc}\n      limit: $limit\n    ) {\n      id\n      name\n      base_experience\n      pokemonsprites { sprites }\n      pokemontypes {\n        type {\n          name\n          typenames(where: {language_id: {_eq: 9}}) { name }\n        }\n      }\n    }\n  }\n": typeof types.TopPokemonByBaseExperienceDocument,
    "\n  query SamplePokemonTypes($limit: Int!) {\n    pokemon(\n      where: { is_default: { _eq: true } }\n      limit: $limit\n      order_by: { id: asc }\n    ) {\n      id\n      pokemontypes {\n        type {\n          name\n          typenames(where: { language_id: { _eq: 9 } }) { name }\n        }\n      }\n    }\n  }\n": typeof types.SamplePokemonTypesDocument,
};
const documents: Documents = {
    "\n  query SearchPokemonById($id: Int!) {\n  pokemon(where: {_and: [{id: {_eq: $id}, is_default: {_eq: true}}]}) {\n    id\n    name\n    weight\n    height\n    base_experience\n    pokemonsprites {\n      sprites\n    }\n    pokemonstats {\n      base_stat\n      stat {\n        name\n        statnames(where: {language_id: {_eq: 9}}) {\n          language {\n            id\n          }\n          name\n        }\n      }\n    }\n    pokemonmoves {\n      move {\n        name\n        movenames(where: {language_id: {_eq: 9}}) {\n          name\n        }\n      }\n    }\n    pokemoncries {\n      cries\n    }\n    pokemonabilities {\n      ability {\n        name\n        abilitynames(where: {language_id: {_eq: 9}}) {\n          name\n        }\n        generation {\n          generationnames_aggregate(where: {language_id: {_eq: 9}}) {\n            nodes {\n              name\n            }\n          }\n        }\n        abilityeffecttexts_aggregate(where: {language_id: {_eq: 9}}) {\n          nodes {\n            short_effect\n            effect\n          }\n        }\n      }\n    }\n    pokemontypes {\n      type {\n        name\n        typenames(where: {language_id: {_eq: 9}}) {\n          name\n        }\n      }\n    }\n  }\n}\n": types.SearchPokemonByIdDocument,
    "\nquery SearchPokemon($searchTerm: String!, $page: Int!) {\n  pokemon_aggregate(\n    where: {_and: [{name: {_ilike: $searchTerm}}, {is_default: {_eq: true}}]}\n    limit: 10\n    offset: $page\n    order_by: {id: asc}\n  ) {\n    aggregate {\n      count\n    }\n    nodes {\n      id\n      name\n      pokemonsprites {\n        sprites\n      }\n      pokemontypes {\n        type {\n          name\n          typenames(where: {language_id: {_eq: 9}}) {\n            name\n          }\n        }\n      }\n    }\n  }\n}\n": types.SearchPokemonDocument,
    "\n  query PokemonAggregates {\n    pokemon_aggregate(where: {is_default: {_eq: true}}) {\n      aggregate {\n        count\n        avg {\n          base_experience\n        }\n      }\n    }\n  }\n": types.PokemonAggregatesDocument,
    "\n  query TopPokemonByBaseExperience($limit: Int!) {\n    pokemon(\n      where: {is_default: {_eq: true}}\n      order_by: {base_experience: desc}\n      limit: $limit\n    ) {\n      id\n      name\n      base_experience\n      pokemonsprites { sprites }\n      pokemontypes {\n        type {\n          name\n          typenames(where: {language_id: {_eq: 9}}) { name }\n        }\n      }\n    }\n  }\n": types.TopPokemonByBaseExperienceDocument,
    "\n  query SamplePokemonTypes($limit: Int!) {\n    pokemon(\n      where: { is_default: { _eq: true } }\n      limit: $limit\n      order_by: { id: asc }\n    ) {\n      id\n      pokemontypes {\n        type {\n          name\n          typenames(where: { language_id: { _eq: 9 } }) { name }\n        }\n      }\n    }\n  }\n": types.SamplePokemonTypesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchPokemonById($id: Int!) {\n  pokemon(where: {_and: [{id: {_eq: $id}, is_default: {_eq: true}}]}) {\n    id\n    name\n    weight\n    height\n    base_experience\n    pokemonsprites {\n      sprites\n    }\n    pokemonstats {\n      base_stat\n      stat {\n        name\n        statnames(where: {language_id: {_eq: 9}}) {\n          language {\n            id\n          }\n          name\n        }\n      }\n    }\n    pokemonmoves {\n      move {\n        name\n        movenames(where: {language_id: {_eq: 9}}) {\n          name\n        }\n      }\n    }\n    pokemoncries {\n      cries\n    }\n    pokemonabilities {\n      ability {\n        name\n        abilitynames(where: {language_id: {_eq: 9}}) {\n          name\n        }\n        generation {\n          generationnames_aggregate(where: {language_id: {_eq: 9}}) {\n            nodes {\n              name\n            }\n          }\n        }\n        abilityeffecttexts_aggregate(where: {language_id: {_eq: 9}}) {\n          nodes {\n            short_effect\n            effect\n          }\n        }\n      }\n    }\n    pokemontypes {\n      type {\n        name\n        typenames(where: {language_id: {_eq: 9}}) {\n          name\n        }\n      }\n    }\n  }\n}\n"): typeof import('./graphql').SearchPokemonByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery SearchPokemon($searchTerm: String!, $page: Int!) {\n  pokemon_aggregate(\n    where: {_and: [{name: {_ilike: $searchTerm}}, {is_default: {_eq: true}}]}\n    limit: 10\n    offset: $page\n    order_by: {id: asc}\n  ) {\n    aggregate {\n      count\n    }\n    nodes {\n      id\n      name\n      pokemonsprites {\n        sprites\n      }\n      pokemontypes {\n        type {\n          name\n          typenames(where: {language_id: {_eq: 9}}) {\n            name\n          }\n        }\n      }\n    }\n  }\n}\n"): typeof import('./graphql').SearchPokemonDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PokemonAggregates {\n    pokemon_aggregate(where: {is_default: {_eq: true}}) {\n      aggregate {\n        count\n        avg {\n          base_experience\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').PokemonAggregatesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TopPokemonByBaseExperience($limit: Int!) {\n    pokemon(\n      where: {is_default: {_eq: true}}\n      order_by: {base_experience: desc}\n      limit: $limit\n    ) {\n      id\n      name\n      base_experience\n      pokemonsprites { sprites }\n      pokemontypes {\n        type {\n          name\n          typenames(where: {language_id: {_eq: 9}}) { name }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').TopPokemonByBaseExperienceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SamplePokemonTypes($limit: Int!) {\n    pokemon(\n      where: { is_default: { _eq: true } }\n      limit: $limit\n      order_by: { id: asc }\n    ) {\n      id\n      pokemontypes {\n        type {\n          name\n          typenames(where: { language_id: { _eq: 9 } }) { name }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').SamplePokemonTypesDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
