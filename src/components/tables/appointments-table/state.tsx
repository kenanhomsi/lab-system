"use client";

import { useDebouncedValue, useMounted } from "@mantine/hooks";
import { PropsWithChildren, useState } from "react";
import type { AppointmentModalType, AppointmentRow } from "./types";
import { useMirrorRegistry } from "./store";

/**
 * Registers local state used by the blood draw appointments table.
 */
const State = ({ children }: PropsWithChildren) => {
  const isHydrated = useMounted();

  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [activeModal, setActiveModal] = useState<AppointmentModalType>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRow | null>(null);

  const [debouncedValue] = useDebouncedValue(searchValue, 400);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("searchValue", searchValue);
  useMirrorRegistry("setSearchValue", setSearchValue);
  useMirrorRegistry("debouncedValue", debouncedValue);
  useMirrorRegistry("statusFilter", statusFilter);
  useMirrorRegistry("setStatusFilter", setStatusFilter);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedAppointment", selectedAppointment);
  useMirrorRegistry("setSelectedAppointment", setSelectedAppointment);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
};

export { State };
