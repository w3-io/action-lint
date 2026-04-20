import type { LintContext } from "../src/types.js";
/**
 * Create a mock LintContext with predetermined file contents.
 *
 *   const ctx = createMockContext({
 *     "package.json": '{"type":"module"}',
 *     ".prettierignore": "dist/\n",
 *   });
 */
export declare function createMockContext(files: Record<string, string>): LintContext;
