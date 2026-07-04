import { backendContainer } from "@/container";
import { unstable_cache } from "next/cache";
import { createHash } from "node:crypto";
import {
  DashboardBackendService,
  dashboardModuleNames,
  type DashboardData,
  type DashboardResponse,
} from "@/modules/dashboard";
import { getServerAccessToken } from "./get-server-access-token";

const dashboardService = backendContainer.get<DashboardBackendService>(
  dashboardModuleNames.service,
);

const DEFAULT_DASHBOARD_CACHE_SECONDS = 30;

const parsedDashboardCacheSeconds = Number(process.env.DASHBOARD_CACHE_SECONDS);

export const DASHBOARD_CACHE_SECONDS =
  Number.isFinite(parsedDashboardCacheSeconds) &&
  parsedDashboardCacheSeconds > 0
    ? parsedDashboardCacheSeconds
    : DEFAULT_DASHBOARD_CACHE_SECONDS;

function hashDashboardToken(token: string): string {
  return createHash("sha256").update(token).digest("hex").slice(0, 32);
}

export function fetchDashboardResponseForToken(
  token: string,
): Promise<DashboardResponse> {
  const tokenHash = hashDashboardToken(token);

  return unstable_cache(
    async () => dashboardService.getDashboard({ token }),
    ["dashboard-data", tokenHash],
    {
      revalidate: DASHBOARD_CACHE_SECONDS,
      tags: [`dashboard-data:${tokenHash}`],
    },
  )();
}

/**
 * Fetches role-scoped dashboard data from the upstream API via the backend service.
 */
export async function fetchDashboardData(): Promise<DashboardData | null> {
  const token = await getServerAccessToken();
  if (!token) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[dashboard] Missing access token in server session — user may need to sign in again.",
      );
    }
    return null;
  }

  try {
    const response = await fetchDashboardResponseForToken(token);
    return response.data;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[dashboard] Upstream fetch or validation failed:", error);
    }
    throw error;
  }
}
