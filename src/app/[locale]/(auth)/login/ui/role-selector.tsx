"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/types/user";

const roles = [
  { id: "patient" as const, icon: "person", labelKey: "patient" },
  { id: "doctor" as const, icon: "medical_services", labelKey: "doctor" },
  { id: "lab" as const, icon: "biotech", labelKey: "lab" },
  { id: "special" as const, icon: "admin_panel_settings", labelKey: "special" },
] as const;

interface RoleSelectorProps {
  value?: UserRole;
  onChange?: (role: UserRole) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const [role, setRole] = useState<UserRole>(value || "patient");
  const t = useTranslations("auth");

  const handleChange = (newRole: UserRole) => {
    setRole(newRole);
    onChange?.(newRole);
  };

  return (
    <div className="mb-10 grid grid-cols-4 gap-2">
      {roles.map((r) => {
        const active = (value ?? role) === r.id;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => handleChange(r.id)}
            className={cn(
              "group flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all duration-300",
              active
                ? "border-primary-container bg-surface-container-highest shadow-sm"
                : "border-transparent bg-surface-container-low hover:border-primary-container/30",
            )}
          >
            <Icon
              name={r.icon}
              filled={active}
              className={cn(
                "mb-2 text-primary transition-transform",
                !active && "group-hover:scale-110",
              )}
              size="sm"
            />
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-tighter",
                active ? "text-primary" : "text-secondary group-hover:text-primary",
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
