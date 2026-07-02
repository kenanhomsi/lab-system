import { z } from "zod";
import {
  BANNER_PLACEMENT,
  BANNER_PLACEMENT_VALUES,
  type BannerPlacement,
  normalizeBannerPlacement,
} from "./placements";

/** Homepage-only card sliders — not selectable as page targets in admin. */
const PAGE_TARGET_EXCLUDED_SECTIONS: ReadonlySet<BannerPlacement> = new Set([
  BANNER_PLACEMENT.MEDICAL_ADVICE,
  BANNER_PLACEMENT.EQUIPMENT,
  BANNER_PLACEMENT.CLIENTS,
  BANNER_PLACEMENT.PARTNERS,
  BANNER_PLACEMENT.DEPARTMENTS,
  BANNER_PLACEMENT.WELCOME,
]);

/** Section placements offered in the page-target admin picker (real pages / dashboards). */
export const PAGE_TARGET_SECTION_PLACEMENTS: readonly BannerPlacement[] =
  BANNER_PLACEMENT_VALUES.filter(
    (placement) => !PAGE_TARGET_EXCLUDED_SECTIONS.has(placement),
  );

/** Prefix for page-specific targets stored in `location` / `addressName`. */
export const PATH_TARGET_PREFIX = "path:" as const;

/** Validates section placements and `path:/…` targets. */
export const PAGE_TARGET_REGEX = /^(path:\/[\w/-]+|[a-z_]+)$/;

export const pageTargetSchema = z
  .string()
  .trim()
  .min(1)
  .regex(PAGE_TARGET_REGEX, "Invalid page target");

export type PageTarget = BannerPlacement | `${typeof PATH_TARGET_PREFIX}${string}`;

export type PageResourceType = "tests" | "blog" | "services" | "offers" | "cms";

export const PAGE_RESOURCE_TYPES: readonly PageResourceType[] = [
  "tests",
  "blog",
  "offers",
  "cms",
] as const;

const SECTION_ROOT_PATHS = new Set([
  "/",
  "/about",
  "/blog",
  "/contact",
  "/services",
  "/careers",
  "/offers",
  "/plans",
  "/tests",
]);

const DETAIL_PATH_PATTERNS = [
  /^\/tests\/.+/,
  /^\/blog\/.+/,
  /^\/services\/.+/,
  /^\/offers\/.+/,
  /^\/lab-encyclopedia\/.+/,
] as const;

export function isPathTarget(value: string): boolean {
  return value.startsWith(PATH_TARGET_PREFIX);
}

export function parsePathTarget(value: string): string | null {
  if (!isPathTarget(value)) return null;
  const raw = value.slice(PATH_TARGET_PREFIX.length).trim();
  if (!raw) return null;
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function buildPathTarget(path: string): string {
  return `${PATH_TARGET_PREFIX}${normalizeTargetPath(path)}`;
}

/** Strips locale prefix and trailing slashes from a pathname. */
export function normalizeTargetPath(pathname: string): string {
  let path = pathname.trim().replace(/\/+$/, "") || "/";
  path = path.replace(/^\/(en|ar)(?=\/|$)/i, "") || "/";
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return path === "" ? "/" : path;
}

export function pathTargetMatches(
  storedTarget: string,
  currentPath: string,
): boolean {
  if (!isPathTarget(storedTarget)) return false;
  const targetPath = parsePathTarget(storedTarget);
  if (!targetPath) return false;
  return normalizeTargetPath(targetPath) === normalizeTargetPath(currentPath);
}

export function parsePathResource(
  path: string,
): { type: PageResourceType; id: string } | null {
  const normalized = normalizeTargetPath(path);
  const matchers: ReadonlyArray<[RegExp, PageResourceType]> = [
    [/^\/tests\/(.+)$/, "tests"],
    [/^\/blog\/(.+)$/, "blog"],
    [/^\/services\/(.+)$/, "services"],
    [/^\/offers\/(.+)$/, "offers"],
  ];

  for (const [regex, type] of matchers) {
    const match = normalized.match(regex);
    if (match?.[1]) {
      return { type, id: decodeURIComponent(match[1]) };
    }
  }

  if (normalized !== "/" && !SECTION_ROOT_PATHS.has(normalized)) {
    return { type: "cms", id: normalized.replace(/^\//, "") };
  }

  return null;
}

export function inferResourceTypeFromTarget(value: string): PageResourceType | null {
  if (!isPathTarget(value)) return null;
  const path = parsePathTarget(value);
  if (!path) return null;
  return parsePathResource(path)?.type ?? null;
}

export function isDetailPagePath(pathname: string): boolean {
  const normalized = normalizeTargetPath(pathname);
  if (normalized === "/") return false;
  if (DETAIL_PATH_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return true;
  }
  return !SECTION_ROOT_PATHS.has(normalized);
}

type SortableTarget = { displayOrder?: number };

export function sortByTargetPriority<T>(
  items: T[],
  getTarget: (item: T) => string,
  getDisplayOrder?: (item: T) => number,
): T[] {
  return [...items].sort((a, b) => {
    const aPath = isPathTarget(getTarget(a));
    const bPath = isPathTarget(getTarget(b));
    if (aPath !== bPath) return aPath ? -1 : 1;
    const aOrder = getDisplayOrder?.(a) ?? ("displayOrder" in (a as SortableTarget)
      ? (a as SortableTarget).displayOrder ?? 0
      : 0);
    const bOrder = getDisplayOrder?.(b) ?? ("displayOrder" in (b as SortableTarget)
      ? (b as SortableTarget).displayOrder ?? 0
      : 0);
    return aOrder - bOrder;
  });
}

export function formatPageTargetLabel(
  value: string,
  translatePlacement: (placement: BannerPlacement) => string,
  translatePageTarget: (key: string, params?: Record<string, string>) => string,
): string {
  if (isPathTarget(value)) {
    const path = parsePathTarget(value) ?? value;
    const resource = parsePathResource(path);
    if (resource) {
      return translatePageTarget(`resourceTypes.${resource.type}`, {
        path,
        id: resource.id,
      });
    }
    return translatePageTarget("specificPage", { path });
  }

  const placement = normalizeBannerPlacement(value);
  if (placement) {
    return translatePlacement(placement);
  }

  return value;
}

export function resolveSectionFromTarget(value: string): BannerPlacement | null {
  if (isPathTarget(value)) return null;
  return normalizeBannerPlacement(value);
}

export { BANNER_PLACEMENT } from "./placements";
