"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { appointmentsClient, type Appointment } from "@/modules/appointments";
import { parsePaginatedList } from "@/lib/api/bff-pagination";
import { useMirror, useMirrorRegistry } from "../store";
import { APPOINTMENTS_PAGE_SIZE, type AppointmentRow } from "../types";

const normalizeAppointment = (value: unknown): AppointmentRow | null => {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Partial<Appointment>;
  if (typeof item.id !== "number") return null;

  return {
    id: item.id,
    availabilityId: Number(item.availabilityId ?? 0),
    testRequestId: Number(item.testRequestId ?? 0),
    userId: String(item.userId ?? ""),
    startTime: String(item.startTime ?? ""),
    endTime: String(item.endTime ?? ""),
    status: String(item.status ?? ""),
    patientLocationType: String(item.patientLocationType ?? ""),
    age:
      item.age !== null && item.age !== undefined && Number.isFinite(Number(item.age))
        ? Number(item.age)
        : null,
    gender: typeof item.gender === "string" && item.gender.trim() ? item.gender : null,
    patientLatitude: item.patientLatitude ?? null,
    patientLongitude: item.patientLongitude ?? null,
    notes: typeof item.notes === "string" ? item.notes : null,
    attachmentUrl: typeof item.attachmentUrl === "string" ? item.attachmentUrl : null,
    createdByUserId: typeof item.createdByUserId === "string" ? item.createdByUserId : null,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : null,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : null,
  };
};

const emptyAppointmentsPage = () => ({
  items: [] as AppointmentRow[],
  page: 1,
  pageSize: APPOINTMENTS_PAGE_SIZE,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

/**
 * Loads blood draw appointments with server-side pagination.
 */
const GetAllAppointments = ({ children }: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const debouncedValue = useMirror("debouncedValue");
  const statusFilter = useMirror("statusFilter");

  const { data, isPending, refetch } = useQuery({
    queryKey: [
      "admin-blood-draw-appointments",
      pageNumber,
      debouncedValue,
      statusFilter,
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        Page: pageNumber,
        PageSize: APPOINTMENTS_PAGE_SIZE,
      };
      if (debouncedValue.trim()) {
        params.Search = debouncedValue.trim();
      }
      if (statusFilter !== "all") {
        params.Status = statusFilter;
      }

      const payload = await appointmentsClient.findAll(params);
      const page = parsePaginatedList<unknown>(payload, pageNumber, APPOINTMENTS_PAGE_SIZE);
      return {
        ...page,
        items: page.items
          .map(normalizeAppointment)
          .filter((item): item is AppointmentRow => item !== null),
      };
    },
  });

  const appointmentsPage = data ?? emptyAppointmentsPage();

  useMirrorRegistry("appointmentsPage", appointmentsPage);
  useMirrorRegistry("appointmentsData", appointmentsPage.items);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchAppointments", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetAllAppointments };
