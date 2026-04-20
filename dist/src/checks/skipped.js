/** Checks that require human/AI judgment — reported as skipped */
export function skippedChecks() {
    return [
        {
            id: "H18",
            status: "skip",
            label: "README.md not stale template text",
            detail: "Requires manual review",
        },
        {
            id: "H19",
            status: "skip",
            label: "docs/guide.md exists with real content",
            detail: "Requires manual review",
        },
        {
            id: "L27",
            status: "skip",
            label: "README has Authentication section",
            detail: "Requires manual review",
        },
        {
            id: "L29",
            status: "skip",
            label: "RESULTS.md has Prerequisites section",
            detail: "Requires manual review",
        },
        {
            id: "M32",
            status: "skip",
            label: "No stub commands (description quality)",
            detail: "Requires manual review",
        },
    ];
}
