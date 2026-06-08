import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/", "node_modules/", "test/fixtures/**"],
  },
  // Base config for any file — the `files:` glob is required under
  // ESLint 9 flat config or files won't actually be linted (the dir
  // arg on the CLI alone doesn't qualify them).
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Node.js runtime globals available in modern Node 20+
        AbortController: "readonly",
        AbortSignal: "readonly",
        Buffer: "readonly",
        TextDecoder: "readonly",
        TextEncoder: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        atob: "readonly",
        btoa: "readonly",
        clearImmediate: "readonly",
        clearInterval: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        crypto: "readonly",
        fetch: "readonly",
        global: "readonly",
        globalThis: "readonly",
        performance: "readonly",
        process: "readonly",
        queueMicrotask: "readonly",
        setImmediate: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
        structuredClone: "readonly",
      },
    },
  },
  js.configs.recommended,
  // TypeScript files: layer the recommended TS configs on top so .ts
  // sources get type-aware linting. Without this, `eslint .` silently
  // skips all .ts files because no TS parser is registered for them.
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files: ["**/*.ts"],
  })),
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  // TypeScript: defer no-unused-vars to the TS variant which
  // understands type-only imports and interface-merge patterns.
  {
    files: ["**/*.ts"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["test/**"],
    languageOptions: {
      globals: {
        global: "readonly",
      },
    },
  },
];
