import type { FormEvent } from "react";
type RegisterRole = "patient" | "doctor" | "LabPartner";

type StateParams = {
  selectedRole: RegisterRole;
  setSelectedRole: (selectedRole: RegisterRole) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
  success: boolean;
  setSuccess: (success: boolean) => void;
  successMessage: string;
  setSuccessMessage: (message: string) => void;
  submitRegisterForm: (e: FormEvent<HTMLFormElement>) => Promise<void>;
};

const store = (): StateParams => ({
  selectedRole: "patient",
  setSelectedRole: () => {},
  loading: false,
  setLoading: () => {},
  error: "",
  setError: () => {},
  success: false,
  setSuccess: () => {},
  successMessage: "",
  setSuccessMessage: () => {},
  submitRegisterForm: async () => {},
});

export { store as StateStore };
export type { StateParams, RegisterRole };
