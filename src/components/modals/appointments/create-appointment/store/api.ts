import { AppointmentForm } from "../types";

type Params = {
  submit: () => Promise<void>;
  canSubmit: boolean;
  createAppointment: (payload: AppointmentForm) => Promise<unknown>;
};

const store = (): Params => ({
  submit: async () => {},
  canSubmit: false,
  createAppointment: async () => null,
});

export { store as apiStore };
