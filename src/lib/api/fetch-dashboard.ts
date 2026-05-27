import { backendContainer } from "@/container";
import {
  DashboardBackendService,
  dashboardModuleNames,
  type DashboardData,
} from "@/modules/dashboard";
import { getServerAccessToken } from "./get-server-access-token";

const dashboardService = backendContainer.get<DashboardBackendService>(
  dashboardModuleNames.service,
);

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
    const response = await dashboardService.getDashboard({ token });
    return response.data;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[dashboard] Upstream fetch or validation failed:", error);
    }
    throw error;
  }
}
