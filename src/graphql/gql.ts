/* eslint-disable */
import * as types from "./graphql";

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
  "\n  query GetAllPokemon($limit: Int = 20, $offset: Int = 0) {\n    pokemonspecies(limit: $limit, offset: $offset, order_by: { id: asc }) {\n      id\n      name\n      pokemon_color_id\n      generation {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetAllPokemonDocument;
  "\n  query GetPokemonByName($name: String!) {\n    pokemonspecies(where: { name: { _eq: $name } }) {\n      id\n      name\n      generation {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetPokemonByNameDocument;
  "\n  query SearchPokemon($searchTerm: String!) {\n    pokemonspecies(\n      where: { name: { _ilike: $searchTerm } }\n      limit: 10\n      order_by: { id: asc }\n    ) {\n      id\n      name\n      generation {\n        id\n        name\n      }\n    }\n  }\n": typeof types.SearchPokemonDocument;
  "\n  query GetPokemonSpritesByIds($ids: [Int!]) {\n    pokemonformsprites(where: { id: { _in: $ids } }) {\n      id\n      pokemon_form_id\n      sprites\n    }\n  }\n": typeof types.GetPokemonSpritesByIdsDocument;
};
const documents: Documents = {
  "\n  query GetAllPokemon($limit: Int = 20, $offset: Int = 0) {\n    pokemonspecies(limit: $limit, offset: $offset, order_by: { id: asc }) {\n      id\n      name\n      pokemon_color_id\n      generation {\n        id\n        name\n      }\n    }\n  }\n":
    types.GetAllPokemonDocument,
  "\n  query GetPokemonByName($name: String!) {\n    pokemonspecies(where: { name: { _eq: $name } }) {\n      id\n      name\n      generation {\n        id\n        name\n      }\n    }\n  }\n":
    types.GetPokemonByNameDocument,
  "\n  query SearchPokemon($searchTerm: String!) {\n    pokemonspecies(\n      where: { name: { _ilike: $searchTerm } }\n      limit: 10\n      order_by: { id: asc }\n    ) {\n      id\n      name\n      generation {\n        id\n        name\n      }\n    }\n  }\n":
    types.SearchPokemonDocument,
  "\n  query GetPokemonSpritesByIds($ids: [Int!]) {\n    pokemonformsprites(where: { id: { _in: $ids } }) {\n      id\n      pokemon_form_id\n      sprites\n    }\n  }\n":
    types.GetPokemonSpritesByIdsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetAllPokemon($limit: Int = 20, $offset: Int = 0) {\n    pokemonspecies(limit: $limit, offset: $offset, order_by: { id: asc }) {\n      id\n      name\n      pokemon_color_id\n      generation {\n        id\n        name\n      }\n    }\n  }\n",
): typeof import("./graphql").GetAllPokemonDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetPokemonByName($name: String!) {\n    pokemonspecies(where: { name: { _eq: $name } }) {\n      id\n      name\n      generation {\n        id\n        name\n      }\n    }\n  }\n",
): typeof import("./graphql").GetPokemonByNameDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query SearchPokemon($searchTerm: String!) {\n    pokemonspecies(\n      where: { name: { _ilike: $searchTerm } }\n      limit: 10\n      order_by: { id: asc }\n    ) {\n      id\n      name\n      generation {\n        id\n        name\n      }\n    }\n  }\n",
): typeof import("./graphql").SearchPokemonDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetPokemonSpritesByIds($ids: [Int!]) {\n    pokemonformsprites(where: { id: { _in: $ids } }) {\n      id\n      pokemon_form_id\n      sprites\n    }\n  }\n",
): typeof import("./graphql").GetPokemonSpritesByIdsDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
