"use client";

import { DashboardApiView, ADMIN_SUMMARY_KEYS } from "@/components/dashboard/api-dashboard";
import { useMirror } from "./store";

const UI = () => {
  const dashboard = useMirror("dashboard");

  return (
    <DashboardApiView
      dashboard={dashboard}
      summaryKeys={ADMIN_SUMMARY_KEYS}
      translationNamespace="admin.dashboard"
      promoLocation="admin_dashboard"
      layout="split"
    />
  );
};

export default UI;
