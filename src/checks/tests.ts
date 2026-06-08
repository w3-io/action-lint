import type { CheckResult, LintContext } from "../types.js";

export function checkTests(ctx: LintContext): CheckResult[] {
  // Raw string read used for substring checks below; the parsed-JSON
  // variant is intentionally not consumed here so use `_pkg` to keep
  // the lazy-load primed for any future checks added in this group.
  const _pkg = ctx.readJson("package.json") as Record<string, unknown> | null;
  void _pkg;
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
