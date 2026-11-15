import { promises as fs } from "node:fs";
import path from "node:path";
import {
  DEFAULT_NAVBAR_CONFIG,
  normalizeNavbarConfig,
  type NavbarConfig,
} from "./types";

const CONFIG_DIR =
  process.env.SITE_CONFIG_DIR || path.join(process.cwd(), "data", "site-config");
const CONFIG_FILE = path.join(CONFIG_DIR, "navbar.json");

/** Reads the navbar config from disk; falls back to defaults when missing or invalid. */
export async function readNavbarConfig(): Promise<NavbarConfig> {
  try {
    const raw = await fs.readFile(CONFIG_FILE, "utf8");
    return normalizeNavbarConfig(JSON.parse(raw));
  } catch {
    return DEFAULT_NAVBAR_CONFIG;
  }
}

/** Persists the navbar config atomically. */
export async function writeNavbarConfig(config: NavbarConfig): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  const tmp = `${CONFIG_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(config, null, 2), "utf8");
  await fs.rename(tmp, CONFIG_FILE);
}

/** Removes the stored config so defaults apply again. */
export async function resetNavbarConfig(): Promise<void> {
  await fs.rm(CONFIG_FILE, { force: true });
}
