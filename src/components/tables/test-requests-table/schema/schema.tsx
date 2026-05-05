"use client";

import { useSessionUserStore } from "@/stores/session-user-store";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getTestRequestsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const roles = useSessionUserStore((s) => s.user?.roles);

  const t = (key: string): string =>
    ({
      colMedicalTest: "Medical Test",
      colRequestDate: "Request Date",
      colDoctorId: "Doctor ID",
      colLabClientId: "Lab Client ID",
      colDirectPatientId: "Direct Patient ID",
      colTotalAmount: "Total Amount",
      tableStatus: "Status",
      colNotes: "Notes",
      colMetadata: "Metadata",
      colCreatedAt: "Created At",
    })[key] ?? key;

  useMirrorRegistry("schema", getTestRequestsColumns(t, { roles }));
  return <>{children}</>;
};

export { Schema };
