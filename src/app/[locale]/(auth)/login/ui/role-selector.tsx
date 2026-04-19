"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useMirror } from "../store";
import { RoleSelectorProps } from "../type";
import { adminRole, loginRoles, registerRoles } from "@/lib/data";
import styles from "../scss/role-selector.module.scss";

export function RoleSelector(props: RoleSelectorProps) {
  const { value, onChange, variant = "login", showAdmin = false } = props;
  const role = useMirror("selectedRole");
  const setRole = useMirror("setSelectedRole");
  const t = useTranslations("auth");
  const baseRoles = variant === "register" ? registerRoles : loginRoles;
  const roles = showAdmin ? [...baseRoles, adminRole] : baseRoles;
  return (
    <div
      className={cn(
        styles.roleGrid,
        variant === "register" && styles.roleGridRegister,
        variant !== "register" && showAdmin && styles.roleGridLoginAdmin,
        variant !== "register" && !showAdmin && styles.roleGridLogin,
      )}
    >
      {roles.map((r) => {
        const active = (value ?? role) === r.id;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setRole(r.id);
              onChange?.(r.id);
            }}
            className={cn(styles.roleButton, active && styles.roleButtonActive)}
          >
            <Icon
              name={r.icon}
              filled={active}
              className={cn(styles.roleIcon, !active && styles.roleIconInactive)}
              size="sm"
            />
            <span
              className={cn(
                styles.roleLabel,
                active ? styles.roleLabelActive : styles.roleLabelInactive,
              )}
            >
              {t(`roles.${r.labelKey}`)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
