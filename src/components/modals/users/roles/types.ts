import { UserItem } from "@/components/tables/users-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserItem | null;
};

export type { FactoryProps };
