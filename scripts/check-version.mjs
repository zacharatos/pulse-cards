// Fails when the version is not the same everywhere it lives: package.json, the two top-level
// fields of package-lock.json, src/version.ts and the built bundle. With a tag argument (vX.Y.Z)
// it also checks the tag. Run by CI; handy locally too: `node scripts/check-version.mjs v1.2.0`.
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const pkg = JSON.parse(read("package.json")).version;
const lock = JSON.parse(read("package-lock.json"));
const src = read("src/version.ts").match(/VERSION = "([^"]+)"/)?.[1];
const bundle = read("dist/pulse-cards.js").includes(`PULSE-CARDS %c v${pkg} `);

const found = {
  "package.json": pkg,
  "package-lock.json (version)": lock.version,
  'package-lock.json (packages[""])': lock.packages?.[""]?.version,
  "src/version.ts": src,
};
const tag = process.argv[2];
if (tag) found[`tag ${tag}`] = tag.replace(/^v/, "");

const wrong = Object.entries(found).filter(([, v]) => v !== pkg);
if (!bundle) wrong.push(["dist/pulse-cards.js", "does not contain the version: rebuild"]);
if (wrong.length) {
  console.error(`Version ${pkg} (package.json) disagrees with:`);
  for (const [where, v] of wrong) console.error(`  ${where}: ${v}`);
  process.exit(1);
}
console.log(`Version ${pkg} agrees everywhere${tag ? `, tag ${tag} included` : ""}.`);
