// eslint.config.ts
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["/public", "/assets", "dist"] },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: new URL(".", import.meta.url),
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "import/no-anonymous-default-export": "off",
      "import/no-deprecated": "warn",
      "import/no-nodejs-modules": "error",
      "import/no-cycle": process.env.ESLINT_DISABLED_NO_CYCLE ? "off" : "error",
      "import/extensions": [
        "error",
        {
          js: "never",
          json: "always",
          svg: "always",
          png: "always",
          jpg: "always",
          ico: "always",
          css: "always",
          sass: "always",
          scss: "always",
          xlsx: "always",
          woff2: "always",
        },
      ],
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["vite.config.ts"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json"],
        tsconfigRootDir: new URL(".", import.meta.url),
      },
    },
    rules: {
      "import/no-nodejs-modules": "off",
    },
  },
  {
    files: ["*.cjs"],
    languageOptions: {
      sourceType: "script",
    },
    rules: {
      "import/no-nodejs-modules": "off",
    },
  },
  {
    files: ["jest.config.js", "script/*"],
    languageOptions: {
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      "import/no-nodejs-modules": "off",
    },
  },
  {
    files: ["*.spec.tsx", "*.spec.ts", "*.test.tsx", "*.test.ts"],
    plugins: {
      vitest: await import("eslint-plugin-vitest"),
      "jest-formatting": await import("eslint-plugin-jest-formatting"),
    },
    extends: [
      "plugin:vitest/recommended",
      "plugin:jest-formatting/recommended",
    ],
    rules: {
      "import/no-nodejs-modules": "off",
    },
  },
  {
    files: ["*.stories.tsx", "*.spec.ts", "*.test.tsx", "*.test.ts"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  }
);
