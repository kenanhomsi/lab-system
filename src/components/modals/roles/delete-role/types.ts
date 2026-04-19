import { RoleItem } from "@/components/tables/roles-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  role: RoleItem | null;
};

export type { FactoryProps };
