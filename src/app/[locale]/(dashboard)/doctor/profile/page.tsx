import { DashboardProfileRoutePage } from "@/components/profile/dashboard-page";

type ProfilePageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

export default function Page(props: ProfilePageProps) {
  return <DashboardProfileRoutePage {...props} />;
}
