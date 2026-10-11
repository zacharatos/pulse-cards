// Prints the CHANGELOG.md section of one version (`## [1.2.0] - …` up to the next `## [`), for the
// GitHub release body. Fails when the section is missing, so a release never goes out undocumented.
import { readFileSync } from "node:fs";

const version = process.argv[2];
const text = readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8");
const start = text.search(new RegExp(`^## \\[${version.replace(/\./g, "\\.")}\\]`, "m"));
if (!version || start < 0) {
  console.error(`CHANGELOG.md has no "## [${version}]" section.`);
  process.exit(1);
}
const rest = text.slice(start);
const next = rest.slice(3).search(/^## \[/m);
const section = (next < 0 ? rest : rest.slice(0, next + 3)).split("\n").slice(1).join("\n").trim();
console.log(section);
