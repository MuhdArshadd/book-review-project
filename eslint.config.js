const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "reports/**",
      "playwright-report/**",
      "test-results/**",
      "docs/.vitepress/dist/**",
      "public/js/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-console": "error",
    },
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },
  {
    files: ["scripts/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
];
