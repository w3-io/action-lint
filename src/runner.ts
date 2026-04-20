import type { LintReport, CheckGroup } from "./types.js";
import { createContext } from "./utils.js";
import {
  checkCiWorkflow,
  checkPrettier,
  checkPackage,
  checkTests,
  checkActionYml,
  checkFilesystem,
  checkManifest,
  skippedChecks,
} from "./checks/index.js";

const VERSION = "1.0.0";

const CHECK_GROUPS: Array<{
  id: string;
  label: string;
  fn: (
    ctx: ReturnType<typeof createContext>,
  ) => ReturnType<typeof checkCiWorkflow>;
}> = [
  { id: "A/K", label: "CI workflow", fn: checkCiWorkflow },
  { id: "B", label: "Prettier", fn: checkPrettier },
  { id: "C/I", label: "Package", fn: checkPackage },
  { id: "D", label: "Tests", fn: checkTests },
  { id: "E/K", label: "action.yml", fn: checkActionYml },
  { id: "F/G/J/K/L", label: "Files", fn: checkFilesystem },
  { id: "M", label: "MCP manifest", fn: checkManifest },
  { id: "H/L/M", label: "Manual review", fn: () => skippedChecks() },
];

export function runLint(cwd: string): LintReport {
  const ctx = createContext(cwd);

  const groups: CheckGroup[] = CHECK_GROUPS.map((mod) => ({
    id: mod.id,
    label: mod.label,
    checks: mod.fn(ctx),
  }));

  const allChecks = groups.flatMap((g) => g.checks);

  return {
    version: VERSION,
    cwd,
    groups,
    passed: allChecks.filter((c) => c.status === "pass").length,
    failed: allChecks.filter((c) => c.status === "fail").length,
    skipped: allChecks.filter((c) => c.status === "skip").length,
  };
}
