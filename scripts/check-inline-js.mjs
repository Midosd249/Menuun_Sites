import { readFileSync, existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const htmlFiles = ["index.html", "owner/index.html"];
const tempDir = mkdtempSync(join(tmpdir(), "menuun-inline-check-"));
let failures = 0;

try {
  for (const file of htmlFiles) {
    const html = readFileSync(resolve(file), "utf8");
    const scripts = [...html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script>/gi)];
    let inlineIndex = 0;

    for (const match of scripts) {
      const attributes = match[1] || "";
      const body = match[2] || "";
      if (/\\bsrc\\s*=/.test(attributes) || !body.trim()) continue;

      const isModule = /\\btype\\s*=\\s*["']module["']/i.test(attributes);
      const tempFile = join(tempDir, file.replace(/[^a-z0-9]/gi, "-") + "-" + inlineIndex++ + (isModule ? ".mjs" : ".js"));
      writeFileSync(tempFile, body, "utf8");
      const result = spawnSync(process.execPath, ["--check", tempFile], { encoding: "utf8" });

      if (result.status !== 0) {
        failures++;
        process.stderr.write("\\n[syntax error] " + file + "\\n" + result.stderr + result.stdout);
      } else {
        process.stdout.write("[syntax ok] " + file + " inline script " + inlineIndex + "\\n");
      }
    }
  }

  const localAssets = [
    ["index.html", "/assets/images/branding/84247619_1791778020070999.jpg", "public/assets/images/branding/84247619_1791778020070999.jpg"],
    ["owner/index.html", "./config.js", "owner/config.js"]
  ];
  for (const [source, reference, target] of localAssets) {
    if (!existsSync(resolve(target))) {
      failures++;
      process.stderr.write("[missing local asset] " + source + " references " + reference + " but " + target + " does not exist\\n");
    } else {
      process.stdout.write("[asset ok] " + source + " -> " + target + "\\n");
    }
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

if (failures) process.exit(1);
process.stdout.write("Static quality checks passed.\\n");
