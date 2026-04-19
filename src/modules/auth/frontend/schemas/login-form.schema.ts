import { infer as infer_, object, string } from "zod";

const loginFormSchema = object({
  identifier: string().trim().min(1, "required").email("invalidEmail"),
  password: string().min(1, "required"),
});

type LoginFormValues = infer_<typeof loginFormSchema>;

export { loginFormSchema };
export type { LoginFormValues };
