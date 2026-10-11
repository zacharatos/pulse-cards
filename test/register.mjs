// Lets `node --test` import the TypeScript sources directly: Node strips the types, and this hook
// adds the ".ts" extension that the bundler-style imports in src/ leave out.
import { register } from "node:module";

register("./resolve-ts.mjs", import.meta.url);
