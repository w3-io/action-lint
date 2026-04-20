export function checkCiWorkflow(ctx) {
    const ci = ctx.readFile(".github/workflows/ci.yml");
    const results = [];
    // A1: workflow file exists
    results.push({
        id: "A1",
        status: ci ? "pass" : "fail",
        label: "CI workflow file exists",
    });
    if (!ci)
        return results;
    // A2: Node 24
    results.push({
        id: "A2",
        status: /node-version:\s*['"]?24['"]?/.test(ci) ? "pass" : "fail",
        label: "Node 24 in setup-node",
    });
    // A3: packages: read permission
    results.push({
        id: "A3",
        status: ci.includes("packages: read") ? "pass" : "fail",
        label: "permissions: packages: read",
    });
    // A4: registry-url + scope
    results.push({
        id: "A4",
        status: ci.includes("registry-url:") && /scope:\s*['"]@w3-io['"]/.test(ci)
            ? "pass"
            : "fail",
        label: "setup-node registry-url + @w3-io scope",
    });
    // A5: NODE_AUTH_TOKEN
    results.push({
        id: "A5",
        status: ci.includes("NODE_AUTH_TOKEN") ? "pass" : "fail",
        label: "NODE_AUTH_TOKEN in npm ci step",
    });
    // A6: npm run build (not package)
    results.push({
        id: "A6",
        status: ci.includes("npm run build") && !ci.includes("npm run package")
            ? "pass"
            : "fail",
        label: "Build step uses npm run build",
    });
    // A7: triggers on main or master
    const hasBranch = ci.includes("main") || ci.includes("master");
    results.push({
        id: "A7",
        status: hasBranch ? "pass" : "fail",
        label: "Triggers on main/master branch",
    });
    // K22: dist staleness guard
    results.push({
        id: "K22",
        status: /git diff.*dist/.test(ci) ? "pass" : "fail",
        label: "dist/ staleness guard in CI",
    });
    return results;
}
