import { defineConfig, globalIgnores } from "eslint/config";
import omni from "./config/eslint.mjs";

export default defineConfig([
    ...omni,
    // This package is the one place allowed to use these directly.
    { rules: { "no-restricted-imports": "off" } },
    globalIgnores(["node_modules/**"]),
]);
