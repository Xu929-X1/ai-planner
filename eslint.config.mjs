import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/",
      "out/",
      "node_modules/",
      "dist/",
      "build/",
      "generated/",
      "**/generated/**",
      "prisma/generated/",
      "types/generated/",
      "__generated__/",
      "*.config.js",
      "*.config.ts",
      "*.snap",
      "*.log",
      ".yarn/",
      ".pnp.*",
      ".cache/",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;