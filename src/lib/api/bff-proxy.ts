import type { NextRequest } from "next/server";

export function isUpstreamBackendReady(): boolean {
  return process.env.UPSTREAM_BACKEND_READY === "true";
}

/** Normalized BACKEND_URL origin (no trailing slash). */
export function getBackendBaseUrl(): string {
  return (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:4000"
  ).replace(/\/+$/, "");
}

export type BuildUpstreamUrlOptions = {
  /** Request query keys that should not be forwarded upstream (e.g. `locale` for mock-only). */
  omitRequestParams?: string[];
};

/**
 * Builds an upstream URL string: `${BACKEND_URL}${pathSuffix}` and merges
 * the incoming BFF query string (e.g. forwarded from the client).
 */
export function buildUpstreamUrl(
  request: NextRequest,
  pathSuffix: string,
  options?: BuildUpstreamUrlOptions,
): URL {
  const base = getBackendBaseUrl();
  const suffix = pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`;
  const url = new URL(`${base}${suffix}`);
  const omit = new Set(options?.omitRequestParams ?? []);
  request.nextUrl.searchParams.forEach((value, key) => {
    if (omit.has(key)) return;
    url.searchParams.set(key, value);
  });
  return url;
}

export type UpstreamGetResult =
  | { ok: true; response: Response }
  | { ok: false; response?: Response; reason: "disabled" | "network" };

export async function fetchUpstreamGet(
  request: NextRequest,
  pathSuffix: string,
  options?: BuildUpstreamUrlOptions,
): Promise<UpstreamGetResult> {
  if (!isUpstreamBackendReady()) {
    return { ok: false, reason: "disabled" };
  }
  try {
    const url = buildUpstreamUrl(request, pathSuffix, options);
    const response = await fetch(url.toString(), { cache: "no-store" });
    return { ok: true, response };
  } catch {
    return { ok: false, reason: "network" };
  }
}
