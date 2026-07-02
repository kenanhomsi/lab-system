"use client";

import type { Appointment } from "@/modules/appointments";
import { useDebouncedValue } from "@mantine/hooks";
import { useCallback, useState } from "react";
import { useMirrorRegistry } from "./store";
import type { AppointmentInlineModalType, TestRequestModalType } from "./store/state";
import { TestRequestItem } from "./types";

type StateProps = {
  children: React.ReactNode;
  initialActiveModal?: "create" | null;
};

const State = ({ children, initialActiveModal = null }: StateProps) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedTestRequest, setSelectedTestRequest] = useState<TestRequestItem | null>(null);
  const [activeModal, setActiveModal] = useState<TestRequestModalType>(initialActiveModal);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [appointmentActiveModal, setAppointmentActiveModal] =
    useState<AppointmentInlineModalType>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [debouncedValue] = useDebouncedValue(searchValue, 500);

  const toggleExpandedRow = useCallback((id: number) => {
    setExpandedRows((current) =>
      current.includes(id) ? current.filter((rowId) => rowId !== id) : [...current, id],
    );
  }, []);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("pageSize", pageSize);
  useMirrorRegistry("setPageSize", setPageSize);
  useMirrorRegistry("searchValue", searchValue);
  useMirrorRegistry("setSearchValue", setSearchValue);
  useMirrorRegistry("debouncedValue", debouncedValue);
  useMirrorRegistry("sortBy", sortBy);
  useMirrorRegistry("setSortBy", setSortBy);
  useMirrorRegistry("sortDesc", sortDesc);
  useMirrorRegistry("setSortDesc", setSortDesc);
  useMirrorRegistry("selectedTestRequest", selectedTestRequest);
  useMirrorRegistry("setSelectedTestRequest", setSelectedTestRequest);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("expandedRows", expandedRows);
  useMirrorRegistry("setExpandedRows", setExpandedRows);
  useMirrorRegistry("toggleExpandedRow", toggleExpandedRow);
  useMirrorRegistry("appointmentActiveModal", appointmentActiveModal);
  useMirrorRegistry("setAppointmentActiveModal", setAppointmentActiveModal);
  useMirrorRegistry("selectedAppointment", selectedAppointment);
  useMirrorRegistry("setSelectedAppointment", setSelectedAppointment);

  return <>{children}</>;
};

export { State };
