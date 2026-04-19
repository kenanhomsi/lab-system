"use client";

import { frontendContainer } from "@/container";
import {
  appointmentModuleNames,
  AppointmentFrontendService,
} from "@/modules/appointment";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { AppointmentsResponse } from "../types";

const appointmentService = frontendContainer.get<AppointmentFrontendService>(
  appointmentModuleNames.service,
);

async function getAllAppointments(params: {
  pageNumber: number;
  search: string;
  status: string;
  patientId: string;
  doctorId: string;
  labPartnerId: string;
}): Promise<AppointmentsResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: "20",
  };

  if (params.search.trim()) query.Search = params.search.trim();
  if (params.status.trim()) query.Status = params.status.trim();
  if (params.patientId.trim()) query.PatientId = params.patientId.trim();
  if (params.doctorId.trim()) query.DoctorId = params.doctorId.trim();
  if (params.labPartnerId.trim()) query.LabPartnerId = params.labPartnerId.trim();

  const payload = await appointmentService.findAll({ query });
  if (!payload) {
    throw new Error("Failed to fetch appointments");
  }
  return payload;
}

const GetAllAppointments = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const debouncedValue = useMirror("debouncedValue");
  const statusFilter = useMirror("statusFilter");
  const patientIdFilter = useMirror("patientIdFilter");
  const doctorIdFilter = useMirror("doctorIdFilter");
  const labPartnerIdFilter = useMirror("labPartnerIdFilter");

  const { data, isPending, refetch } = useQuery({
    queryKey: [
      "appointments",
      pageNumber,
      debouncedValue,
      statusFilter,
      patientIdFilter,
      doctorIdFilter,
      labPartnerIdFilter,
    ],
    queryFn: () =>
      getAllAppointments({
        pageNumber,
        search: debouncedValue,
        status: statusFilter,
        patientId: patientIdFilter,
        doctorId: doctorIdFilter,
        labPartnerId: labPartnerIdFilter,
      }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("appointmentsData", data ?? {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchAppointments", () => {
    void refetch();
  });

  return props;
};

export { GetAllAppointments };
