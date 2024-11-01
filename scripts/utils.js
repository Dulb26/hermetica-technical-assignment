import { configDotenv } from "dotenv";
import { template } from "lodash-es";
import fs from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { URL, fileURLToPath } from "node:url";
import { parse as parseToml } from "toml";
import { $ } from "zx";

export const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
export const envDir = resolve(rootDir, "env");

/**
 * Get the arguments passed to the script.
 *
 * @returns {[args: string[], envName: string | undefined]}
 */
export function getArgs() {
  const args = process.argv.slice(2);
  /** @type {String} */
  let envName;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--env") {
      envName = args[i + 1];
      args.splice(i, 2);
      break;
    }

    if (args[i]?.startsWith("--env=")) {
      envName = args[i].slice(6);
      args.splice(i, 1);
      break;
    }
  }

  return [args, envName];
}

export async function readWranglerConfig(file, envName = "test") {
  const envDir = fileURLToPath(new URL("..", import.meta.url));

  configDotenv({ path: resolve(envDir, `.env.${envName}.local`) });
  configDotenv({ path: resolve(envDir, `.env.local`) });
  configDotenv({ path: resolve(envDir, `.env`) });

  // Load Wrangler CLI configuration file
  let config = parseToml(await fs.readFile(file, "utf-8"));

  // Interpolate environment variables
  return JSON.parse(JSON.stringify(config), (key, value) => {
    return typeof value === "string"
      ? template(value, {
          interpolate: /\$\{?([\w]+)\}?/,
        })($.env)
      : value;
  });
}
