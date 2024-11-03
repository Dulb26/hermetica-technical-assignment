import { defineWorkspace } from "vitest/config";
import { workspaces } from "./package.json";

/**
 * Inline Vitest configuration for all workspaces.
 *
 * @see https://vitest.dev/guide/workspace
 */
export default defineWorkspace(
  workspaces.map((name) => ({
    extends: `./${name}/vite.config.ts`,
    test: {
      name,
      root: `./${name}`,
    },
  })),
);
