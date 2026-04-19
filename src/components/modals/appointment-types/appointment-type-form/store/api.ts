import {
  CreateAppointmentTypeRequest,
  UpdateAppointmentTypeRequest,
} from "@/components/tables/appointment-types-table/types";

type Params = {
  createAppointmentTypeApi: (payload: CreateAppointmentTypeRequest) => Promise<unknown>;
  updateAppointmentTypeApi: (id: number, payload: UpdateAppointmentTypeRequest) => Promise<unknown>;
};

const store = (): Params => ({
  createAppointmentTypeApi: async () => null,
  updateAppointmentTypeApi: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
