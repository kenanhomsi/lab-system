import { PermissionItem } from "@/components/tables/permissions-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  permission: PermissionItem | null;
};

export type { FactoryProps };
