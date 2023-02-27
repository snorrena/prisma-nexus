//api/schema.ts
import { __Directive } from "graphql";
import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql"; //imports from the index.ts file by default. The index.ts file is used to re-export all type definitions contained in the graphql directory

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
    schema: join(__dirname, "..", "schema.graphql.ts"),
  },
  contextType: {
    module: join(__dirname, "./context.ts"),
    export: "Context",
  },
});
