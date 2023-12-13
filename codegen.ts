import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./node_modules/@octokit/graphql-schema/schema.json",
  documents: "**/*.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-resolvers",
        "typescript-document-nodes",
        "typescript-operations",
      ],
    },
  },
};

export default config;
