import { UserRole } from "@/types/user";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturnType } from "@mantine/form";
type FormValues = {
  email: string;
  password: string;
};

type Params = {
showAdmin: boolean;
setShowAdmin: (showAdmin: boolean | ((prev: boolean) => boolean)) => void;
selectedRole: UserRole;
  setSelectedRole: (selectedRole: UserRole) => void;
  setFieldValue: UseFormReturnType<FormValues>["setFieldValue"];
  getInputProps: UseFormReturnType<FormValues>["getInputProps"];
  setErrors: UseFormReturnType<FormValues>["setErrors"];
  values: UseFormReturnType<FormValues>["values"];
  onSubmit: UseFormReturnType<FormValues>["onSubmit"];
};

const store = (): Params =>
  ({
      showAdmin: false,
  setShowAdmin: () => {},
  selectedRole: "patient",
  setSelectedRole: () => { },
    setFieldValue: () => {},
    getInputProps: () => ({ value: "", onChange: () => {} }),
    setErrors: () => {},
    values: { email: "", password: "" },
    onsubmit: () => {},
  }) as any;


export { store as StateStore };
export type { Params as StateParams  , FormValues};



