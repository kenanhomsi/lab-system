"use client";

import { DashboardApiView, PATIENT_SUMMARY_KEYS } from "@/components/dashboard/api-dashboard";
import { useMirror } from "./store";

const UI = () => {
  const dashboard = useMirror("dashboard");
  const slideCards = useMirror("slideCards");

  return (
    <DashboardApiView
      dashboard={dashboard}
      slideCards={slideCards}
      summaryKeys={PATIENT_SUMMARY_KEYS}
      translationNamespace="patient.dashboard"
      promoLocation="patient_dashboard"
      layout="split"
    />
  );
};

export default UI;
