"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { UserRole } from "@/types/user";

const roleRedirects: Record<UserRole, string> = {
  patient: "/dashboard",
  doctor: "/doctor/request-tests",
  lab: "/lab/order-tests",
  special: "/special/daily-tasks",
};

interface LoginFormProps {
  selectedRole?: UserRole;
}

export function LoginForm({ selectedRole = "patient" }: LoginFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        role: selectedRole,
        redirect: false,
      });

      if (result?.error) {
        setError(t("loginError"));
        return;
      }

      router.push(`/${locale}${roleRedirects[selectedRole]}`);
    } catch {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="space-y-1.5">
        <label
          htmlFor="identifier"
          className="block ps-1 text-[11px] font-bold uppercase tracking-widest text-secondary"
        >
          {t("identifier")}
        </label>
        <div className="relative">
          <Icon
            name="alternate_email"
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-lg text-outline"
            size="sm"
          />
          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="email"
            required
            placeholder={t("identifierPlaceholder")}
            className="w-full rounded-xl border-none bg-surface-container-low py-4 ps-12 pe-4 text-sm placeholder:text-outline-variant transition-all duration-300 focus:bg-surface-container-lowest focus:ring-0"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-end justify-between px-1">
          <label
            htmlFor="password"
            className="block text-[11px] font-bold uppercase tracking-widest text-secondary"
          >
            {t("password")}
          </label>
          <Link
            href={`/${locale}/forgot-password`}
            className="text-[10px] font-semibold text-primary hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <Icon
            name="lock"
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-lg text-outline"
            size="sm"
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full rounded-xl border-none bg-surface-container-low py-4 ps-12 pe-12 text-sm placeholder:text-outline-variant transition-all duration-300 focus:bg-surface-container-lowest focus:ring-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="material-symbols-outlined absolute end-4 top-1/2 -translate-y-1/2 text-lg text-outline hover:text-primary"
            aria-label={t("togglePassword")}
          >
            {showPassword ? "visibility_off" : "visibility"}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-1">
        <input
          id="remember"
          name="remember"
          type="checkbox"
          className="h-4 w-4 rounded-md border-outline-variant text-primary focus:ring-primary/20"
        />
        <label htmlFor="remember" className="text-xs font-medium text-secondary">
          {t("rememberMe")}
        </label>
      </div>
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="clinical-gradient flex w-full items-center justify-center gap-2 rounded-xl py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/40 disabled:opacity-50"
        >
          <span>{loading ? t("signingIn") : t("signIn")}</span>
          {!loading && <Icon name="arrow_forward" className="!text-sm rtl:rotate-180" size="sm" />}
        </button>
      </div>
    </form>
  );
}
