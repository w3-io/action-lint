import type { CheckResult, LintContext } from "../types.js";

/** Simple filesystem existence checks: F16, G17, J21, K25, K26, L28 */
export function checkFilesystem(ctx: LintContext): CheckResult[] {
  const results: CheckResult[] = [];

  // F16: dist/index.js committed
  results.push({
    id: "F16",
    status: ctx.fileExists("dist/index.js") ? "pass" : "fail",
    label: "dist/index.js exists",
  });

  // G17: eslint.config.js (flat v9)
  results.push({
    id: "G17",
    status: ctx.fileExists("eslint.config.js") ? "pass" : "fail",
    label: "eslint.config.js exists (flat v9)",
  });

  // J21: .npmrc with scope
  const npmrc = ctx.readFile(".npmrc") ?? "";
  results.push({
    id: "J21",
    status: npmrc.includes("npm.pkg.github.com") ? "pass" : "fail",
    label: ".npmrc with @w3-io scope mapping",
  });

  // K25: E2E test workflow exists
  const e2eFiles = ctx.globSync("test/workflows/*.yaml");
  const ymlFiles = ctx.globSync("test/workflows/*.yml");
  results.push({
    id: "K25",
    status: e2eFiles.length + ymlFiles.length > 0 ? "pass" : "fail",
    label: "E2E test workflow exists",
  });

  // K26: RESULTS.md exists
  results.push({
    id: "K26",
    status: ctx.fileExists("test/workflows/RESULTS.md") ? "pass" : "fail",
    label: "test/workflows/RESULTS.md exists",
  });

  // L28: TODO.md exists
  results.push({
    id: "L28",
    status: ctx.fileExists("TODO.md") ? "pass" : "fail",
    label: "TODO.md exists",
  });

  return results;
}
