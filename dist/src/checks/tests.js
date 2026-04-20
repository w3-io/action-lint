export function checkTests(ctx) {
    const pkg = ctx.readJson("package.json");
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
