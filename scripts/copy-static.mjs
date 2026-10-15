import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const copies = [
  ["templates", "public/templates"],
  ["assets/brand/menuun", "public/assets/brand/menuun"]
];

for (const [sourceRelative, destinationRelative] of copies) {
  const source = resolve(sourceRelative);
  const destination = resolve(destinationRelative);
  if (!existsSync(source)) {
    process.stdout.write(`Skipped missing optional asset source: ${sourceRelative}\n`);
    continue;
  }
  mkdirSync(resolve(destination, ".."), { recursive: true });
  cpSync(source, destination, { recursive: true, force: true });
  process.stdout.write(`Prepared ${sourceRelative} → ${destinationRelative}\n`);
}
