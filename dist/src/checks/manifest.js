export function checkManifest(ctx) {
    const manifest = ctx.readYaml("w3-action.yaml");
    const results = [];
    if (!manifest) {
        results.push({
            id: "M30",
            status: "fail",
            label: "Every command has typed inputs",
            detail: "w3-action.yaml not found",
        });
        return results;
    }
    const commands = manifest.commands ?? [];
    // M30: every command has inputs (at least an empty {} block).
    // Commands with inputs: {} are fine (discovery commands). The
    // distinction that matters is whether the `inputs` key exists at
    // all — earlier code computed a parallel `missingInputs` filter
    // that was a tautology and went unused; removed.
    const commandsWithoutInputs = commands.filter((c) => !("inputs" in c));
    results.push({
        id: "M30",
        status: commandsWithoutInputs.length === 0 ? "pass" : "fail",
        label: "Every command has typed inputs",
        detail: commandsWithoutInputs.length > 0
            ? `Missing inputs: ${commandsWithoutInputs.map((c) => c.name).join(", ")}`
            : undefined,
    });
    // M31: every command has a result output
    const missingResult = commands.filter((c) => {
        const outputs = c.outputs ?? {};
        return !("result" in outputs);
    });
    results.push({
        id: "M31",
        status: missingResult.length === 0 ? "pass" : "fail",
        label: "Every command has result output",
        detail: missingResult.length > 0
            ? `Missing result output: ${missingResult.map((c) => c.name).join(", ")}`
            : undefined,
    });
    // M33: partner present and lowercase
    const partner = manifest.partner ?? "";
    results.push({
        id: "M33",
        status: partner.length > 0 && /^[a-z0-9-]+$/.test(partner) ? "pass" : "fail",
        label: "partner field present and lowercase",
        detail: !partner
            ? "partner field missing"
            : !/^[a-z0-9-]+$/.test(partner)
                ? `Found: "${partner}" (must be lowercase)`
                : undefined,
    });
    // M34: name is short (< 5 words)
    const name = manifest.name ?? "";
    const wordCount = name.split(/\s+/).filter(Boolean).length;
    results.push({
        id: "M34",
        status: name.length > 0 && wordCount <= 4 ? "pass" : "fail",
        label: "name field is short (< 5 words)",
        detail: !name
            ? "name field missing"
            : wordCount > 4
                ? `"${name}" has ${wordCount} words (max 4)`
                : undefined,
    });
    // M35: description exists and > 20 chars
    const desc = (manifest.description ?? "").trim();
    results.push({
        id: "M35",
        status: desc.length > 20 ? "pass" : "fail",
        label: "description exists (> 20 chars)",
        detail: !desc
            ? "description field missing"
            : desc.length <= 20
                ? `Only ${desc.length} chars`
                : undefined,
    });
    // M36: context exists and > 50 chars
    const context = (manifest.context ?? "").trim();
    results.push({
        id: "M36",
        status: context.length > 50 ? "pass" : "fail",
        label: "context exists (> 50 chars)",
        detail: !context
            ? "context field missing"
            : context.length <= 50
                ? `Only ${context.length} chars`
                : undefined,
    });
    return results;
}
