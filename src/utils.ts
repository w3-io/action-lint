import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import type { LintContext } from "./types.js";

export function createContext(cwd: string): LintContext {
  const fileCache = new Map<string, string | null>();

  function readFile(path: string): string | null {
    const full = join(cwd, path);
    if (fileCache.has(path)) return fileCache.get(path)!;
    try {
      const content = readFileSync(full, "utf8");
      fileCache.set(path, content);
      return content;
    } catch {
      fileCache.set(path, null);
      return null;
    }
  }

  return {
    cwd,

    readFile,

    readYaml(path: string): unknown | null {
      const content = readFile(path);
      if (!content) return null;
      try {
        return parseYaml(content);
      } catch {
        return null;
      }
    },

    readJson(path: string): unknown | null {
      const content = readFile(path);
      if (!content) return null;
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    },

    fileExists(path: string): boolean {
      return existsSync(join(cwd, path));
    },

    globSync(pattern: string): string[] {
      // Simple glob for src/*.js — handles the common case
      const parts = pattern.split("/");
      const dir = parts.slice(0, -1).join("/");
      const filePattern = parts[parts.length - 1];
      const fullDir = join(cwd, dir);

      if (!existsSync(fullDir)) return [];

      const regex = new RegExp(
        "^" + filePattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$",
      );

      const results: string[] = [];
      try {
        for (const entry of readdirSync(fullDir)) {
          const fullPath = join(fullDir, entry);
          if (statSync(fullPath).isFile() && regex.test(entry)) {
            results.push(join(dir, entry));
          }
        }
      } catch {
        // directory not readable
      }
      return results;
    },
  };
}
