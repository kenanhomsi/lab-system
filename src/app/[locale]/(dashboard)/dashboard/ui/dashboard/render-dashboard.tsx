import { DashboardHero } from "./dashboard-hero";
import { KpiMetrics } from "./kpi-metrics";
import { PatientResultsTable } from "./patient-results-table";
import { PromoCard } from "./promo-card";
import { ReferralChart } from "./referral-chart";
import { RequestHistory } from "./request-history";
import { SupportCard } from "./support-card";
import { TestCatalog } from "./test-catalog";

export function RenderDashboard() {
  return (
    <main className="bg-background p-6 md:p-8">
      <DashboardHero />

      <KpiMetrics />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <PatientResultsTable />
          <ReferralChart />
          <RequestHistory />
        </div>
        <div className="space-y-8">
          <TestCatalog />
          <SupportCard />
          <PromoCard />
        </div>
      </div>
    </main>
  );
}
