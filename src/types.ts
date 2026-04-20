export type CheckStatus = "pass" | "fail" | "skip";

export interface CheckResult {
  id: string;
  status: CheckStatus;
  label: string;
  detail?: string;
}

export interface CheckGroup {
  id: string;
  label: string;
  checks: CheckResult[];
}

export interface LintReport {
  version: string;
  cwd: string;
  groups: CheckGroup[];
  passed: number;
  failed: number;
  skipped: number;
}

export interface LintContext {
  cwd: string;
  readFile(path: string): string | null;
  readYaml(path: string): unknown | null;
  readJson(path: string): unknown | null;
  fileExists(path: string): boolean;
  globSync(pattern: string): string[];
}

export type CheckFn = (ctx: LintContext) => CheckResult[];
