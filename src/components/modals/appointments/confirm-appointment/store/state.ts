import { AppointmentItem } from "@/components/tables/appointments-table/types";

type Params = {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentItem | null;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  handleClose: () => void;
};

const store = (): Params => ({
  isOpen: false,
  onClose: () => {},
  appointment: null,
  isSubmitting: false,
  setIsSubmitting: () => {},
  handleClose: () => {},
});

export { store as stateStore };
