"use client";

import { useState, type InputHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const defaultInputClassName =
  "w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

type AuthPasswordFieldProps = {
  id: string;
  label: string;
  labelClassName?: string;
  inputClassName?: string;
  value?: string;
  onValueChange?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange">;

/**
 * Password input with show/hide toggle for auth flows (register, reset password).
 */
export function AuthPasswordField({
  id,
  label,
  labelClassName = "mb-1 block text-xs font-bold uppercase tracking-widest text-secondary",
  inputClassName = defaultInputClassName,
  value,
  onValueChange,
  className,
  name,
  ...inputProps
}: AuthPasswordFieldProps) {
  const t = useTranslations("auth");
  const [visible, setVisible] = useState(false);
  const isControlled = value !== undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={isControlled ? value : undefined}
          onChange={
            isControlled
              ? (e) => onValueChange?.(e.target.value)
              : undefined
          }
          className={cn(inputClassName, "pe-12")}
          {...inputProps}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((prev) => !prev)}
          aria-label={t("togglePassword")}
          aria-pressed={visible}
          className="absolute end-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-secondary transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Icon
            name={visible ? "visibility_off" : "visibility"}
            size="sm"
            aria-hidden
          />
        </button>
      </div>
    </div>
  );
}
