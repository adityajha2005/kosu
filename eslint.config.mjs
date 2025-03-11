import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Completely disable unused variables warning
      "@typescript-eslint/no-unused-vars": "off",

      // Completely disable restriction on 'any' type
      "@typescript-eslint/no-explicit-any": "off",

      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off",

      // Allow usage of <img> instead of <Image />
      "@next/next/no-img-element": "off",

      // Disable TypeScript type checking errors
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];

export default eslintConfig;
