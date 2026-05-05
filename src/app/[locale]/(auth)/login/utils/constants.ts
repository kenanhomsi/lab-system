import type { UserRole } from "@/types/user";

export const FORM_ERROR_KEY = "form" as const;

export const roleRedirects: Record<UserRole, string> = {
  patient: "/dashboard",
  doctor: "/doctor/request-tests",
  LabPartner: "/lab/dashboard",
  special: "/special/daily-tasks",
  admin: "/admin/dashboard",
};

export type LoginAuthMessages = {
  required: string;
  invalidEmail: string;
  loginError: string;
};

export function mapZodCodeToLoginMessage(
  code: string | undefined,
  messages: LoginAuthMessages,
): string | undefined {
  if (!code) return undefined;
  if (code === "required") return messages.required;
  if (code === "invalidEmail") return messages.invalidEmail;
  return messages.loginError;
}
