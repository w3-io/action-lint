const isTTY = process.stdout.isTTY;
const green = (s) => (isTTY ? `\x1b[32m${s}\x1b[0m` : s);
const red = (s) => (isTTY ? `\x1b[31m${s}\x1b[0m` : s);
const dim = (s) => (isTTY ? `\x1b[2m${s}\x1b[0m` : s);
export function formatList(report) {
    const lines = [];
    lines.push(`@w3-io/action-lint v${report.version}\n`);
    for (const group of report.groups) {
        lines.push(`${group.label}`);
        for (const check of group.checks) {
            const icon = check.status === "pass"
                ? green("[PASS]")
                : check.status === "fail"
                    ? red("[FAIL]")
                    : dim("[SKIP]");
            lines.push(`  ${icon} ${check.id.padEnd(5)} ${check.label}`);
            if (check.detail && check.status !== "pass") {
                lines.push(`         ${dim("→ " + check.detail)}`);
            }
        }
        lines.push("");
    }
    const summary = `${report.passed} passed, ${report.failed} failed, ${report.skipped} skipped (manual review)`;
    if (report.failed > 0) {
        lines.push(red(`--- ${summary} ---`));
    }
    else {
        lines.push(green(`--- ${summary} ---`));
    }
    return lines.join("\n");
}
export function formatJson(report) {
    return JSON.stringify(report, null, 2);
}
