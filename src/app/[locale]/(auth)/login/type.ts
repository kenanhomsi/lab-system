import type { UserRole } from "@/types/user";
export interface RoleSelectorProps {
  value?: UserRole;
  onChange?: (role: UserRole) => void;
  /** Register flow only allows patient/doctor/lab */
  variant?: "login" | "register";
  showAdmin?: boolean;
}