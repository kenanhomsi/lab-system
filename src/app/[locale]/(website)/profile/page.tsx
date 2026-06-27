import { ProfilePage } from "@/components/profile";
import { parseProfileTab } from "@/components/profile/store/state";

type ProfilePageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

/**
 * Authenticated account hub rendered inside the public website shell.
 */
export default async function Page({ searchParams }: ProfilePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialTab = parseProfileTab(resolvedSearchParams?.tab);

  return <ProfilePage initialTab={initialTab} />;
}
