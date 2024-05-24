import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginNoRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import eslintPluginImport from "eslint-plugin-import";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    // acts as global ignore
    ignores: [
      "dist/*",
      "build/*",
      "eslint.config.js",
      "vite.config.ts",
      "scripts/*",
    ],
  },
  {
    plugins: {
      "no-relative-import-paths": eslintPluginNoRelativeImportPaths,
      import: eslintPluginImport,
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // import lints ############################################
      "no-duplicate-imports": ["error", { includeExports: true }],
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { allowSameFolder: true },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // naming lints ##########################################
      // require `public`/`private` class modifier
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "typeLike", format: ["PascalCase"] },
        {
          selector: "memberLike",
          format: null,
          leadingUnderscore: "forbid",
        },
        {
          selector: "memberLike",
          format: null,
          modifiers: ["private"],
          leadingUnderscore: "require",
        },
      ],
      // allow prefixed unused varables
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // type lints ############################################
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      // allow calling class methods in callback
      "@typescript-eslint/unbound-method": "off",
    },
  },
);
