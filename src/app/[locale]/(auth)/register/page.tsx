"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { RoleSelector } from "../login/ui/role-selector";
import type { UserRole } from "@/types/user";

type RegisterRole = Exclude<UserRole, "special">;

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<RegisterRole>("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      role: selectedRole,
      email: formData.get("email") as string,
      mobile: formData.get("mobile") as string,
      fullName: formData.get("fullName") as string,
      city: formData.get("city") as string,
      password: formData.get("password") as string,
      ...(selectedRole === "patient" && {
        age: Number(formData.get("age")),
        gender: formData.get("gender") as string,
      }),
      ...(selectedRole === "doctor" && {
        specialty: formData.get("specialty") as string,
      }),
      ...(selectedRole === "lab" && {
        labName: formData.get("labName") as string,
      }),
    };

    const confirmPassword = formData.get("confirmPassword") as string;
    if (payload.password !== confirmPassword) {
      setError(t("passwordMismatch"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("registerError"));
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/login`), 2000);
    } catch {
      setError(t("registerError"));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Icon name="check_circle" className="text-5xl text-green-600" />
          </div>
          <h2 className="mb-2 font-headline text-2xl font-bold">{t("registerSuccess")}</h2>
          <p className="text-secondary">{t("redirectToLogin")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link href={`/${locale}`} className="mb-6 inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
              <span
                className="material-symbols-outlined text-2xl text-on-primary"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
              >
                biotech
              </span>
            </div>
            <span className="font-headline text-2xl font-extrabold tracking-tighter text-on-surface">
              {t("brand")}
            </span>
          </Link>
          <h2 className="mt-4 font-headline text-3xl font-bold text-on-surface">{t("createNewAccount")}</h2>
          <p className="mt-2 text-sm text-secondary">{t("selectAccountType")}</p>
        </div>

        <RoleSelector
          value={selectedRole}
          onChange={(role) => {
            if (role !== "special") setSelectedRole(role as RegisterRole);
          }}
        />

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("fullName")}
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
              />
            </div>
            <div>
              <label htmlFor="mobile" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("mobile")}
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
            />
          </div>

          <div>
            <label htmlFor="city" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
              {t("city")}
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
            />
          </div>

          {selectedRole === "patient" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                  {t("age")}
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min={0}
                  max={150}
                  required
                  className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
                />
              </div>
              <div>
                <label htmlFor="gender" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                  {t("gender")}
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
                >
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                </select>
              </div>
            </div>
          )}

          {selectedRole === "doctor" && (
            <div>
              <label htmlFor="specialty" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("specialty")}
              </label>
              <input
                id="specialty"
                name="specialty"
                type="text"
                required
                className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
              />
            </div>
          )}

          {selectedRole === "lab" && (
            <div>
              <label htmlFor="labName" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("labName")}
              </label>
              <input
                id="labName"
                name="labName"
                type="text"
                required
                className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="w-full rounded-xl border-none bg-surface-container-low py-3 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="clinical-gradient flex w-full items-center justify-center gap-2 rounded-xl py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/40 disabled:opacity-50"
            >
              {loading ? t("creatingAccount") : t("createAccount")}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-secondary">
          {t("haveAccount")}{" "}
          <Link href={`/${locale}/login`} className="font-bold text-primary hover:underline">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </main>
  );
}
