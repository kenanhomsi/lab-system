"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";

type Step = "identifier" | "code" | "newPassword";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("sendCodeError"));
        return;
      }
      setStep("code");
    } catch {
      setError(t("sendCodeError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (code.length < 4) {
      setError(t("invalidCode"));
      return;
    }
    setStep("newPassword");
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("resetError"));
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/login`), 2000);
    } catch {
      setError(t("resetError"));
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
          <h2 className="mb-2 font-headline text-2xl font-bold">{t("passwordResetSuccess")}</h2>
          <p className="text-secondary">{t("redirectToLogin")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md">
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
          <h2 className="mt-4 font-headline text-3xl font-bold">{t("forgotPasswordTitle")}</h2>
          <p className="mt-2 text-sm text-secondary">{t("forgotPasswordDesc")}</p>
        </div>

        {/* Progress indicators */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {(["identifier", "code", "newPassword"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-colors ${
                (["identifier", "code", "newPassword"] as Step[]).indexOf(step) >= i
                  ? "bg-primary"
                  : "bg-surface-container-low"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {step === "identifier" && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("emailOrMobile")}
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full rounded-xl border-none bg-surface-container-low py-4 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
                placeholder={t("identifierPlaceholder")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="clinical-gradient w-full rounded-xl py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? t("sending") : t("sendCode")}
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label htmlFor="code" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("verificationCode")}
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                className="w-full rounded-xl border-none bg-surface-container-low py-4 px-4 text-center text-lg tracking-[0.5em] transition-all focus:bg-surface-container-lowest focus:ring-0"
                placeholder="------"
              />
            </div>
            <button
              type="submit"
              className="clinical-gradient w-full rounded-xl py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20"
            >
              {t("verifyCode")}
            </button>
          </form>
        )}

        {step === "newPassword" && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("newPassword")}
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border-none bg-surface-container-low py-4 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                {t("confirmPassword")}
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border-none bg-surface-container-low py-4 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="clinical-gradient w-full rounded-xl py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? t("resetting") : t("resetPassword")}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-secondary">
          <Link href={`/${locale}/login`} className="font-bold text-primary hover:underline">
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </main>
  );
}
