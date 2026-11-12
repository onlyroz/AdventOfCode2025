import js from "@eslint/js";

// Node globals used by this repo, declared here so no extra package is needed
const nodeGlobals = {
  console: "readonly",
  process: "readonly",
  performance: "readonly",
  fetch: "readonly",
  URL: "readonly",
  Buffer: "readonly",
};

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: nodeGlobals,
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: ["node_modules/"],
  },
];
