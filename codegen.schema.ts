import type { CodegenConfig } from "@graphql-codegen/cli";

// Refreshes the vendored schema from the live PokeAPI endpoint. Run this by
// hand when you want upstream changes, review the diff as its own commit, then
// run `pnpm run codegen` to regenerate types against it.
const config: CodegenConfig = {
  schema: "https://graphql.pokeapi.co/v1beta2",
  generates: {
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
