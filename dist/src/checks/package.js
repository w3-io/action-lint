export function checkPackage(ctx) {
    const pkg = ctx.readJson("package.json");
    const results = [];
    if (!pkg) {
        results.push({
            id: "C9",
            status: "fail",
            label: "@w3-io/action-core >= ^0.4.1",
            detail: "package.json not found",
        });
        return results;
    }
    // C9: action-core version >= 0.4.1
    const coreVersion = pkg.dependencies?.["@w3-io/action-core"] ?? "";
    const match = coreVersion.match(/\^(\d+)\.(\d+)\.\d+/);
    const versionOk = match !== null &&
        (Number(match[1]) >= 1 ||
            (Number(match[1]) === 0 && Number(match[2]) >= 4));
    results.push({
        id: "C9",
        status: versionOk ? "pass" : "fail",
        label: "@w3-io/action-core >= ^0.4.1",
        detail: versionOk ? undefined : `Found: ${coreVersion || "missing"}`,
    });
    // C10: ESM
    results.push({
        id: "C10",
        status: pkg.type === "module" ? "pass" : "fail",
        label: '"type": "module" in package.json',
    });
    // C11: no getBooleanInput in source
    const srcFiles = ctx.globSync("src/*.js");
    const hasBooleanInput = srcFiles.some((f) => {
        const content = ctx.readFile(f);
        return content?.includes("getBooleanInput") ?? false;
    });
    results.push({
        id: "C11",
        status: hasBooleanInput ? "fail" : "pass",
        label: "No getBooleanInput in src/",
    });
    // I20: standard scripts
    const scripts = pkg.scripts ?? {};
    const required = ["format", "format:check", "lint", "test", "build", "all"];
    const allPresent = required.every((s) => s in scripts);
    results.push({
        id: "I20",
        status: allPresent ? "pass" : "fail",
        label: "Standard scripts (format, lint, test, build, all)",
        detail: allPresent
            ? undefined
            : `Missing: ${required.filter((s) => !(s in scripts)).join(", ")}`,
    });
    return results;
}
