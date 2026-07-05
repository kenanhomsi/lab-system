import { ProfilePage } from "./factory";
import { parseProfileTab } from "./store/state";

type DashboardProfileRoutePageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

/**
 * Profile page rendered inside the dashboard shell (sidebar + navbar).
 */
export async function DashboardProfileRoutePage({
  searchParams,
}: DashboardProfileRoutePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialTab = parseProfileTab(resolvedSearchParams?.tab);

  return <ProfilePage initialTab={initialTab} />;
}
