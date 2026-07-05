import { DashboardLoadingSkeleton } from "@/components/dashboard/dashboard-loading-skeleton";
import dashboardStyles from "./styles.module.scss";

export default function DashboardLoading() {
  return (
    <div className={dashboardStyles.sectionPadding}>
      <DashboardLoadingSkeleton />
    </div>
  );
}
