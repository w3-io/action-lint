import type { CheckResult, LintContext } from "../types.js";

export function checkTests(ctx: LintContext): CheckResult[] {
  // Raw string read powers the substring checks below. The JSON-parsed
  // variant isn't needed here; if a future check needs it, add the
  // `readJson` call at that site.
  const pkgStr = ctx.readFile("package.json") ?? "";

  return [
    // D12: no jest
    {
      id: "D12",
      status: pkgStr.includes('"jest"') ? "fail" : "pass",
      label: "No jest dependency",
    },
    // D13: no __tests__/
    {
      id: "D13",
      status: ctx.fileExists("__tests__") ? "fail" : "pass",
      label: "No __tests__/ directory (use test/)",
    },
  ];
}
