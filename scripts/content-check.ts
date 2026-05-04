import { content, validateContent } from "../src/lib/content";

const report = validateContent(content);

if (!report.ok) {
  console.error("Content check failed.");
  for (const failure of report.failures) console.error(`- ${failure}`);
  for (const hit of report.placeholderHits) console.error(`- disallowed marker: ${hit}`);
  process.exit(1);
}

console.log("Content check passed.");
console.log(JSON.stringify(report.counts, null, 2));
