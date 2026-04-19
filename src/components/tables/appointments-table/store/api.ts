import { AppointmentsResponse, CreateAppointmentRequest } from "../types";

type Params = {
  appointmentsData: AppointmentsResponse;
  isPending: boolean;
  refetchAppointments: () => void;
  createAppointment: (payload: CreateAppointmentRequest) => Promise<unknown>;
  confirmAppointment: (id: number) => Promise<unknown>;
  cancelAppointment: (id: number) => Promise<unknown>;
};

const store = (): Params => ({
  appointmentsData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchAppointments: () => {},
  createAppointment: async () => null,
  confirmAppointment: async () => null,
  cancelAppointment: async () => null,
});

export { store as apiStore };
export type { Params as ApiParams };
