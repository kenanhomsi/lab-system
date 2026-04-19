type Step = "identifier" | "code" | "newPassword";

type Params = {
  step: Step;
  setStep: (step: Step) => void;
  identifier: string;
  setIdentifier: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  error: string;
  setError: (v: string) => void;
  success: boolean;
  setSuccess: (v: boolean) => void;
};

const store = (): Params => ({
  step: "identifier",
  setStep: () => {},
  identifier: "",
  setIdentifier: () => {},
  code: "",
  setCode: () => {},
  newPassword: "",
  setNewPassword: () => {},
  confirmPassword: "",
  setConfirmPassword: () => {},
  loading: false,
  setLoading: () => {},
  error: "",
  setError: () => {},
  success: false,
  setSuccess: () => {},
});

export { store as StateStore };
export type { Params as StateParams, Step };
