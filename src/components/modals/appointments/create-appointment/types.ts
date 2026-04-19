import { CreateAppointmentRequest } from "@/components/tables/appointments-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AppointmentForm = CreateAppointmentRequest;

export type { AppointmentForm, FactoryProps };
