import {
  UpdateUserRequest as UpdateUserPayload,
  UserItem,
} from "@/components/tables/users-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserItem | null;
};

const initialValues: UpdateUserPayload = {
  fullName: "",
  city: "",
  phoneNumber: "",
  profileMetadata: "",
};

export type { FactoryProps, UpdateUserPayload };
export { initialValues };
