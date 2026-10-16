
import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(
        new URL("./src", import.meta.url)
      ),
    },
  },

  test: {
    environment: "node",

    include: [
      "tests/**/*.test.ts",
    ],

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],

      include: [
        "src/schemas/**/*.ts",
        "src/lib/db/parse-analysis-record.ts",
        "src/lib/ai/validate-ai-response.ts",
      ],

      exclude: [
        "**/*.test.ts",
        "src/generated/**",
      ],
    },
  },
});

