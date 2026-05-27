"use client";

import { DashboardApiView, DOCTOR_SUMMARY_KEYS } from "@/components/dashboard/api-dashboard";
import { useMirror } from "./store";

const UI = () => {
  const dashboard = useMirror("dashboard");

  return (
    <DashboardApiView
      dashboard={dashboard}
      summaryKeys={DOCTOR_SUMMARY_KEYS}
      translationNamespace="doctor.dashboard"
      promoLocation="doctor_dashboard"
      layout="split"
    />
  );
};

export default UI;
