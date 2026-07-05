import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", ".next", "next-env.d.ts"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ["./tsconfig.json"],
      },
    },
  },
  {
    files: ["src/subjects/**/*.ts"],
    rules: {
      "no-useless-escape": "off",
    },
  },
]);
