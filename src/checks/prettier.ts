import type { CheckResult, LintContext } from "../types.js";

export function checkPrettier(ctx: LintContext): CheckResult[] {
  const ignore = ctx.readFile(".prettierignore") ?? "";

  return [
    {
      id: "B8",
      status: /^dist\//m.test(ignore) ? "pass" : "fail",
      label: ".prettierignore excludes dist/",
    },
  ];
}
