"use client";

import { useDebouncedValue } from "@mantine/hooks";
import { PropsWithChildren, useState } from "react";
import { AppointmentItem, AppointmentModalType } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [patientIdFilter, setPatientIdFilter] = useState("");
  const [doctorIdFilter, setDoctorIdFilter] = useState("");
  const [labPartnerIdFilter, setLabPartnerIdFilter] = useState("");

  const [activeModal, setActiveModal] = useState<AppointmentModalType | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(
    null,
  );

  const [debouncedValue] = useDebouncedValue(searchValue, 500);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("searchValue", searchValue);
  useMirrorRegistry("setSearchValue", setSearchValue);
  useMirrorRegistry("debouncedValue", debouncedValue);
  useMirrorRegistry("statusFilter", statusFilter);
  useMirrorRegistry("setStatusFilter", setStatusFilter);
  useMirrorRegistry("patientIdFilter", patientIdFilter);
  useMirrorRegistry("setPatientIdFilter", setPatientIdFilter);
  useMirrorRegistry("doctorIdFilter", doctorIdFilter);
  useMirrorRegistry("setDoctorIdFilter", setDoctorIdFilter);
  useMirrorRegistry("labPartnerIdFilter", labPartnerIdFilter);
  useMirrorRegistry("setLabPartnerIdFilter", setLabPartnerIdFilter);

  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedAppointment", selectedAppointment);
  useMirrorRegistry("setSelectedAppointment", setSelectedAppointment);

  return <>{children}</>;
};

export { State };
