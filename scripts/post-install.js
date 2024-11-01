import { execa } from "execa";
import fs from "node:fs";
import { EOL } from "node:os";

// Create Git-ignored files for environment variable overrides
if (!fs.existsSync("./.env.local")) {
  await fs.writeFile(
    "./.env.local",
    [
      `# Overrides for the \`.env\` file in the root folder.`,
      "#",
      "#",
      "",
      "API_URL=http://localhost:8080",
      "",
    ].join(EOL),
    "utf-8",
  );
}

try {
  await execa("yarn", ["tsc", "--build"], { stdin: "inherit" });
} catch (err) {
  console.error(err);
}
