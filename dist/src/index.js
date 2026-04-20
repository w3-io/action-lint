#!/usr/bin/env node
import { parseArgs } from "node:util";
import { runLint } from "./runner.js";
import { formatList, formatJson } from "./reporter.js";
const { values } = parseArgs({
    options: {
        json: { type: "boolean", default: false },
        quiet: { type: "boolean", short: "q", default: false },
        help: { type: "boolean", short: "h", default: false },
    },
});
if (values.help) {
    console.log(`@w3-io/action-lint — Standards linter for W3 partner action repos

Usage:
  npx @w3-io/action-lint           Run all checks in current directory
  npx @w3-io/action-lint --json    Output as JSON
  npx @w3-io/action-lint --quiet   Exit code only (no output)
  npx @w3-io/action-lint --help    Show this help

Checks 31 deterministic standards from AGENTS.md.
5 judgment-based checks are skipped (require manual review).

Exit code: 0 if all deterministic checks pass, 1 if any fail.`);
    process.exit(0);
}
const report = runLint(process.cwd());
if (values.json) {
    console.log(formatJson(report));
}
else if (!values.quiet) {
    console.log(formatList(report));
}
process.exit(report.failed > 0 ? 1 : 0);
