import type { AppointmentAdminStatus } from "@/modules/appointments";
import type { AppointmentRow } from "../types";

type Params = {
  appointmentsRaw: AppointmentRow[];
  appointmentsData: AppointmentRow[];
  isPending: boolean;
  refetchAppointments: () => void;
  cancelAppointment: (id: number) => Promise<unknown>;
  updateAppointmentStatus: (payload: {
    id: number;
    status: AppointmentAdminStatus;
  }) => Promise<unknown>;
};

const store = (): Params => ({
  appointmentsRaw: [],
  appointmentsData: [],
  isPending: false,
  refetchAppointments: () => {},
  cancelAppointment: async () => null,
  updateAppointmentStatus: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
