"use client";

import { DashboardApiView, PATIENT_SUMMARY_KEYS } from "@/components/dashboard/api-dashboard";
import { useMirror } from "./store";

const UI = () => {
  const dashboard = useMirror("dashboard");

  return (
    <DashboardApiView
      dashboard={dashboard}
      summaryKeys={PATIENT_SUMMARY_KEYS}
      translationNamespace="patient.dashboard"
      promoLocation="patient_dashboard"
      layout="split"
    />
  );
};

export default UI;
