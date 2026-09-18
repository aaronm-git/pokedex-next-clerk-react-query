import type { CodegenConfig } from "@graphql-codegen/cli";

// Generation reads the vendored schema on disk, never the network, so the
// generated types are reproducible from the committed source alone. To take
// upstream changes, run `pnpm run codegen:schema` first and review that diff
// on its own before regenerating.
const config: CodegenConfig = {
  schema: "./schema.graphql",
  documents: ["src/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./src/lib/graphql/": {
      preset: "client",
      config: {
        documentMode: "string",
        useTypeImports: true,
      },
    },
  },
};

export default config;
