import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    // acts as global ignore
    ignores: ["dist/*", "build/*", "eslint.config.js"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      // allow calling class methods in callback
      "@typescript-eslint/unbound-method": "off",
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
    },
  },
);
