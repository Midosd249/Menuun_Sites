import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const output = resolve("dist");
mkdirSync(output, { recursive: true });

for (const directory of ["owner", "templates", "assets"]) {
  const source = resolve(directory);
  if (existsSync(source)) {
    cpSync(source, resolve(output, directory), { recursive: true, force: true });
    process.stdout.write(`Copied ${directory}/ into dist/\n`);
  }
}
