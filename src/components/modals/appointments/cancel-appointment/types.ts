import { AppointmentItem } from "@/components/tables/appointments-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentItem | null;
};

export type { FactoryProps };
