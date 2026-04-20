/**
 * Create a mock LintContext with predetermined file contents.
 *
 *   const ctx = createMockContext({
 *     "package.json": '{"type":"module"}',
 *     ".prettierignore": "dist/\n",
 *   });
 */
export function createMockContext(files) {
    return {
        cwd: "/mock",
        readFile(path) {
            return files[path] ?? null;
        },
        readYaml(path) {
            const content = files[path];
            if (!content)
                return null;
            // Lazy import to avoid top-level await
            const { parse } = await_yaml();
            try {
                return parse(content);
            }
            catch {
                return null;
            }
        },
        readJson(path) {
            const content = files[path];
            if (!content)
                return null;
            try {
                return JSON.parse(content);
            }
            catch {
                return null;
            }
        },
        fileExists(path) {
            return path in files;
        },
        globSync(pattern) {
            const parts = pattern.split("/");
            const dir = parts.slice(0, -1).join("/");
            const filePattern = parts[parts.length - 1];
            const regex = new RegExp("^" + filePattern.replace(/\*/g, ".*") + "$");
            return Object.keys(files).filter((f) => {
                const fileDir = f.includes("/")
                    ? f.substring(0, f.lastIndexOf("/"))
                    : "";
                const fileName = f.includes("/")
                    ? f.substring(f.lastIndexOf("/") + 1)
                    : f;
                return fileDir === dir && regex.test(fileName);
            });
        },
    };
}
// Sync yaml import helper
let _yaml = null;
function await_yaml() {
    if (!_yaml) {
        // Dynamic require for sync context
        _yaml = require("yaml");
    }
    return _yaml;
}
