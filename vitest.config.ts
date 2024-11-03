import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: ["./app/vitest.setup.ts"],
    include: ["./app/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "dist/**",
        ".yarn/**",
        ".cache/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/test/**",
        "**/__tests__/**",
        "**/*.test.*",
        "**/index.{ts,tsx}",
        "app/postcss.config.cjs",
        "app/dist/**",
        "app/tailwind.config.cjs",
        ".eslintrc.cjs",
        ".pnp.*",
        "vitest.*.ts",
      ],
    },
  },
});
