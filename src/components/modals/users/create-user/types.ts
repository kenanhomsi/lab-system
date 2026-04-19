import { CreateUserRequest as CreateUserPayload } from "@/components/tables/users-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialValues: CreateUserPayload = {
  email: "",
  password: "",
  fullName: "",
  city: "",
  phoneNumber: "",
  roles: [],
  profileMetadata: "",
};

export type { FactoryProps, CreateUserPayload };
export { initialValues };
