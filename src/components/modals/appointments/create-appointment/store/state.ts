import { AppointmentForm } from "../types";

type Params = {
  isOpen: boolean;
  onClose: () => void;
  form: AppointmentForm;
  isSubmitting: boolean;
  updateField: <K extends keyof AppointmentForm>(key: K, value: AppointmentForm[K]) => void;
  setIsSubmitting: (value: boolean) => void;
  handleClose: () => void;
};

const store = (): Params => ({
  isOpen: false,
  onClose: () => {},
  form: {
    appointmentTypeId: 0,
    name: "",
    description: "",
    notes: "",
    slot: "",
    locationType: "",
    address: "",
    latitude: 0,
    longitude: 0,
    patientId: "",
    doctorId: "",
    labPartnerId: "",
  },
  isSubmitting: false,
  updateField: () => {},
  setIsSubmitting: () => {},
  handleClose: () => {},
});

export { store as stateStore };
