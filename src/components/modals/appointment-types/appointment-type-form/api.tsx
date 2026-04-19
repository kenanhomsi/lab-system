"use client";

import { useMirror as useTableMirror } from "@/components/tables/appointment-types-table/store";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const createAppointmentTypeApi = useTableMirror("createAppointmentType");
  const updateAppointmentTypeApi = useTableMirror("updateAppointmentType");

  useMirrorRegistry("createAppointmentTypeApi", createAppointmentTypeApi);
  useMirrorRegistry("updateAppointmentTypeApi", updateAppointmentTypeApi);

  return <>{children}</>;
};

export { Api };
