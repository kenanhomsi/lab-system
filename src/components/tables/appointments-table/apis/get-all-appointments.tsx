"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { appointmentsClient, type Appointment } from "@/modules/appointments";
import { useMirrorRegistry } from "../store";
import type { AppointmentRow } from "../types";

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
    patientLatitude: item.patientLatitude ?? null,
    patientLongitude: item.patientLongitude ?? null,
    notes: typeof item.notes === "string" ? item.notes : null,
    createdByUserId: typeof item.createdByUserId === "string" ? item.createdByUserId : null,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : null,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : null,
  };
};

const asAppointmentRows = (payload: unknown): AppointmentRow[] => {
  if (Array.isArray(payload)) {
    return payload
      .map(normalizeAppointment)
      .filter((item): item is AppointmentRow => item !== null);
  }
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) {
      return inner
        .map(normalizeAppointment)
        .filter((item): item is AppointmentRow => item !== null);
    }
  }
  return [];
};

/**
 * Loads blood draw appointments and mirrors them into the table store.
 */
const GetAllAppointments = ({ children }: PropsWithChildren) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-blood-draw-appointments"],
    queryFn: () => appointmentsClient.findAll(),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("appointmentsRaw", asAppointmentRows(data));
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchAppointments", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetAllAppointments, asAppointmentRows };
