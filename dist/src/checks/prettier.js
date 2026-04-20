export function checkPrettier(ctx) {
    const ignore = ctx.readFile(".prettierignore") ?? "";
    return [
        {
            id: "B8",
            status: /^dist\//m.test(ignore) ? "pass" : "fail",
            label: ".prettierignore excludes dist/",
        },
    ];
}
