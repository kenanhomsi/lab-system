import { UserItem } from "@/components/tables/users-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserItem | null;
};

type PermissionsResponse = { permissions?: string[]; [key: string]: unknown };

export type { FactoryProps, PermissionsResponse };
