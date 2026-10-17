import { appendFileSync, existsSync, readFileSync } from "node:fs";

const resultsPath = "test-results/results.json";
const summaryPath = process.env.GITHUB_STEP_SUMMARY;
let markdown = "## Playwright failure summary\n\n";
if (!existsSync(resultsPath)) {
  markdown += "Playwright JSON results were not produced; inspect the test step log and HTML artifact.\n";
} else {
  const report = JSON.parse(readFileSync(resultsPath, "utf8"));
  const failures = [];
  function visit(suite, parents = []) {
    const titles = [...parents, suite.title].filter(Boolean);
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const last = (test.results || []).at(-1);
        if (test.status !== "unexpected" && !["failed", "timedOut", "interrupted"].includes(last?.status)) continue;
        const error = (last?.errors || []).map(item => item.message || item.stack || "").filter(Boolean).join("\n") || "No error message captured";
        const lines = error.split("\n").map(line => line.trim()).filter(Boolean);
        const assertion = lines.find(line => /expect\(|Expected:|Received:|Locator:|AssertionError|Error:/.test(line)) || lines[0] || "See full log";
        failures.push({name:[...titles,spec.title].filter(Boolean).join(" › "),location:spec.file?(spec.file+(spec.line?":"+spec.line:"")):"",error:lines[0]||"Unknown error",assertion});
      }
    }
    for (const child of suite.suites || []) visit(child, titles);
  }
  for (const suite of report.suites || []) visit(suite);
  if (!failures.length) markdown += "No failing tests reported by Playwright JSON reporter.\n";
  else {
    markdown += "| Test name | Error message | First failing assertion |\n|---|---|---|\n";
    for (const failure of failures) {
      const cell = value => String(value).replaceAll("|", "\\|").replaceAll("\n", " ").slice(0, 350);
      markdown += `| ${cell(failure.name+(failure.location?" ("+failure.location+")":""))} | ${cell(failure.error)} | ${cell(failure.assertion)} |\n`;
    }
  }
}
if (summaryPath) appendFileSync(summaryPath, markdown + "\n");
console.log(markdown);
