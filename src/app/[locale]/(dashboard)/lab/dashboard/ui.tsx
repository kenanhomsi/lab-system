"use client";

import { DashboardApiView, LAB_PARTNER_SUMMARY_KEYS } from "@/components/dashboard/api-dashboard";
import { useMirror } from "./store";

const UI = () => {
  const dashboard = useMirror("dashboard");

  return (
    <DashboardApiView
      dashboard={dashboard}
      summaryKeys={LAB_PARTNER_SUMMARY_KEYS}
      translationNamespace="lab.dashboard"
      promoLocation="lab_dashboard"
      layout="split"
    />
  );
};

export default UI;
