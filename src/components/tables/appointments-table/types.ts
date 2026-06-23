import type { Appointment } from "@/modules/appointments";

export type AppointmentModalType = "cancel" | "edit" | null;

export type AppointmentRow = Appointment;

export type AppointmentsPage = {
  items: AppointmentRow[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const APPOINTMENTS_PAGE_SIZE = 20;
