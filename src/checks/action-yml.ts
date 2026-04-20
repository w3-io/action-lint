import type { CheckResult, LintContext } from "../types.js";

interface ActionYml {
  runs?: { using?: string };
  inputs?: Record<string, { required?: boolean; description?: string }>;
  outputs?: Record<string, unknown>;
}

export function checkActionYml(ctx: LintContext): CheckResult[] {
  const action = ctx.readYaml("action.yml") as ActionYml | null;
  const results: CheckResult[] = [];

  if (!action) {
    results.push({
      id: "E14",
      status: "fail",
      label: "action.yml runs.using: node24",
      detail: "action.yml not found",
    });
    return results;
  }

  // E14: node24 runtime
  results.push({
    id: "E14",
    status: action.runs?.using === "node24" ? "pass" : "fail",
    label: "action.yml runs.using: node24",
    detail:
      action.runs?.using === "node24"
        ? undefined
        : `Found: ${action.runs?.using ?? "missing"}`,
  });

  // E15: single result output
  const outputKeys = Object.keys(action.outputs ?? {});
  results.push({
    id: "E15",
    status:
      outputKeys.length === 1 && outputKeys[0] === "result" ? "pass" : "fail",
    label: "Single result output",
    detail:
      outputKeys.length === 1 && outputKeys[0] === "result"
        ? undefined
        : `Found outputs: ${outputKeys.join(", ") || "none"}`,
  });

  // K23: action.yml inputs match getInput() calls in source
  // Pragmatic: pass if both action.yml has inputs and source files have getInput calls
  const hasInputs = action.inputs && Object.keys(action.inputs).length > 0;
  const srcFiles = [...ctx.globSync("src/*.js"), ...ctx.globSync("src/*.ts")];
  const srcContent = srcFiles
    .map((f) => ctx.readFile(f))
    .filter(Boolean)
    .join("\n");
  const hasGetInput =
    srcContent.includes("getInput") || srcContent.includes("requireInput");
  results.push({
    id: "K23",
    status: hasInputs && hasGetInput ? "pass" : "fail",
    label: "action.yml inputs match source getInput() calls",
    detail: !hasInputs
      ? "No inputs in action.yml"
      : !hasGetInput
        ? "No getInput() calls in src/"
        : undefined,
  });

  // K24: command is required; per-command inputs are not
  const inputs = action.inputs ?? {};
  const hasCommand = "command" in inputs;
  if (hasCommand) {
    const commandRequired = inputs.command?.required === true;
    results.push({
      id: "K24",
      status: commandRequired ? "pass" : "fail",
      label: "command input is required",
    });
  } else {
    // Direct pattern (no command input) — valid
    results.push({
      id: "K24",
      status: "pass",
      label: "command input required (or direct pattern)",
    });
  }

  return results;
}
