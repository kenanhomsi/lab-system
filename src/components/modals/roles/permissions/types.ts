import {
  RoleItem,
  RolePermissionItem,
} from "@/components/tables/roles-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  role: RoleItem | null;
};

type PermissionCatalogItem = {
  id: string;
  name: string;
  description: string;
};

export type { FactoryProps, PermissionCatalogItem, RolePermissionItem };
