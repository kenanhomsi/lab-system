"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { AuthPasswordField } from "@/components/ui/auth-password-field";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useMirror } from "./store";

const UI = () => {
  const loading = useMirror("loading");
  const error = useMirror("error");
  const success = useMirror("success");
  const successMessage = useMirror("successMessage");
  const submitRegisterForm = useMirror("submitRegisterForm");
  const locale = useLocale();
  const t = useTranslations("auth");
  const inputClassName =
    "w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Icon name="check_circle" className="text-5xl text-green-600" />
          </div>
          <h2 className="mb-2 font-headline text-2xl font-bold">{t("registerSuccess")}</h2>
          {successMessage ? (
            <p className="mb-2 text-on-surface">{successMessage}</p>
          ) : null}
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
            <BrandLogo
              label={t("brand")}
              priority
              labelClassName="text-on-surface"
            />
          </Link>
          <h2 className="mt-4 font-headline text-3xl font-bold text-on-surface">{t("createNewAccount")}</h2>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
          >
            {error}
          </div>
        )}

        <form onSubmit={submitRegisterForm} className="space-y-4" aria-busy={loading}>
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
                autoComplete="name"
                className={inputClassName}
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
                autoComplete="tel"
                className={inputClassName}
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
              autoComplete="email"
              className={inputClassName}
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
              autoComplete="address-level2"
              className={inputClassName}
            />
          </div>

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
                className={inputClassName}
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
                className={inputClassName}
              >
                <option value="male">{t("male")}</option>
                <option value="female">{t("female")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthPasswordField
              id="password"
              name="password"
              label={t("password")}
              inputClassName={inputClassName}
              required
              autoComplete="new-password"
              minLength={6}
            />
            <AuthPasswordField
              id="confirmPassword"
              name="confirmPassword"
              label={t("confirmPassword")}
              inputClassName={inputClassName}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="clinical-gradient flex w-full items-center justify-center gap-2 rounded-xl py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
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
};

export default UI;
