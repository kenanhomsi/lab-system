import { AppointmentTypeItem } from "@/components/tables/appointment-types-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  appointmentType: AppointmentTypeItem | null;
};

export type { FactoryProps };
