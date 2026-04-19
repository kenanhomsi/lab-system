import {
  AppointmentTypesResponse,
  CreateAppointmentTypeRequest,
  UpdateAppointmentTypeRequest,
} from "../types";

type Params = {
  typesData: AppointmentTypesResponse;
  isPending: boolean;
  refetchAppointmentTypes: () => void;
  createAppointmentType: (payload: CreateAppointmentTypeRequest) => Promise<unknown>;
  updateAppointmentType: (
    id: number,
    payload: UpdateAppointmentTypeRequest,
  ) => Promise<unknown>;
};

const store = (): Params => ({
  typesData: [],
  isPending: false,
  refetchAppointmentTypes: () => {},
  createAppointmentType: async () => null,
  updateAppointmentType: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
