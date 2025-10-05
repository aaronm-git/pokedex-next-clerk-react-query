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
    "\n  query SearchPokemonById($id: Int!) {\n  pokemon(where: {id: {_eq: $id}}) {\n    name\n    base_experience\n    pokemonstats {\n      stat {\n        name\n        characteristics_aggregate {\n          nodes {\n            characteristicdescriptions_aggregate(where: {language: {name: {_eq: \"en\"}}}) {\n              nodes {\n                description\n              }\n            }\n          }\n        }\n      }\n      base_stat\n    }\n    pokemonmoves {\n      move {\n        name\n      }\n    }\n    pokemoncries {\n      cries\n    }\n    pokemonabilities {\n      ability {\n        name\n      }\n    }\n    pokemonsprites {\n      sprites\n    }\n    pokemontypes {\n      type {\n        name\n      }\n    }\n  }\n}\n": typeof types.SearchPokemonByIdDocument,
    "\n  query SearchPokemon($searchTerm: String!) {\n    pokemon(\n      where: { name: { _ilike: $searchTerm } }\n      limit: 10\n      order_by: { id: asc }\n    ) {\n      id\n      name\n      pokemoncries {\n        cries\n      }\n      pokemonsprites {\n        sprites\n      }\n    }\n  }\n": typeof types.SearchPokemonDocument,
};
const documents: Documents = {
    "\n  query SearchPokemonById($id: Int!) {\n  pokemon(where: {id: {_eq: $id}}) {\n    name\n    base_experience\n    pokemonstats {\n      stat {\n        name\n        characteristics_aggregate {\n          nodes {\n            characteristicdescriptions_aggregate(where: {language: {name: {_eq: \"en\"}}}) {\n              nodes {\n                description\n              }\n            }\n          }\n        }\n      }\n      base_stat\n    }\n    pokemonmoves {\n      move {\n        name\n      }\n    }\n    pokemoncries {\n      cries\n    }\n    pokemonabilities {\n      ability {\n        name\n      }\n    }\n    pokemonsprites {\n      sprites\n    }\n    pokemontypes {\n      type {\n        name\n      }\n    }\n  }\n}\n": types.SearchPokemonByIdDocument,
    "\n  query SearchPokemon($searchTerm: String!) {\n    pokemon(\n      where: { name: { _ilike: $searchTerm } }\n      limit: 10\n      order_by: { id: asc }\n    ) {\n      id\n      name\n      pokemoncries {\n        cries\n      }\n      pokemonsprites {\n        sprites\n      }\n    }\n  }\n": types.SearchPokemonDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchPokemonById($id: Int!) {\n  pokemon(where: {id: {_eq: $id}}) {\n    name\n    base_experience\n    pokemonstats {\n      stat {\n        name\n        characteristics_aggregate {\n          nodes {\n            characteristicdescriptions_aggregate(where: {language: {name: {_eq: \"en\"}}}) {\n              nodes {\n                description\n              }\n            }\n          }\n        }\n      }\n      base_stat\n    }\n    pokemonmoves {\n      move {\n        name\n      }\n    }\n    pokemoncries {\n      cries\n    }\n    pokemonabilities {\n      ability {\n        name\n      }\n    }\n    pokemonsprites {\n      sprites\n    }\n    pokemontypes {\n      type {\n        name\n      }\n    }\n  }\n}\n"): typeof import('./graphql').SearchPokemonByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchPokemon($searchTerm: String!) {\n    pokemon(\n      where: { name: { _ilike: $searchTerm } }\n      limit: 10\n      order_by: { id: asc }\n    ) {\n      id\n      name\n      pokemoncries {\n        cries\n      }\n      pokemonsprites {\n        sprites\n      }\n    }\n  }\n"): typeof import('./graphql').SearchPokemonDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
