"use client";

import { DashboardApiView, DOCTOR_SUMMARY_KEYS } from "@/components/dashboard/api-dashboard";
import { useMirror } from "./store";

const UI = () => {
  const dashboard = useMirror("dashboard");
  const slideCards = useMirror("slideCards");

  return (
    <DashboardApiView
      dashboard={dashboard}
      slideCards={slideCards}
      summaryKeys={DOCTOR_SUMMARY_KEYS}
      translationNamespace="doctor.dashboard"
      promoLocation="doctor_dashboard"
      layout="split"
    />
  );
};

export default UI;
