"use client";

import { useTranslations } from "next-intl";
import { useMirror } from "../store";

export function NewPasswordForm() {
  const t = useTranslations("auth");
  const email = useMirror("email");
  const code = useMirror("code");
  const newPassword = useMirror("newPassword");
  const setNewPassword = useMirror("setNewPassword");
  const confirmPassword = useMirror("confirmPassword");
  const setConfirmPassword = useMirror("setConfirmPassword");
  const loading = useMirror("loading");
  const setLoading = useMirror("setLoading");
  const setError = useMirror("setError");
  const setSuccess = useMirror("setSuccess");
  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmit =
    !loading &&
    newPassword.trim().length >= 6 &&
    confirmPassword.trim().length >= 6 &&
    !passwordMismatch;

  async function handleSubmit(e: React.FormEvent) {
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
        body: JSON.stringify({ email, code, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("resetError"));
        return;
      }
      setSuccess(true);
    } catch {
      setError(t("resetError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="newPassword"
          className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary"
        >
          {t("newPassword")}
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={6}
          className="w-full rounded-xl border-none bg-surface-container-low px-4 py-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      </div>
      <div>
        <label
          htmlFor="confirmNewPassword"
          className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary"
        >
          {t("confirmPassword")}
        </label>
        <input
          id="confirmNewPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={6}
          aria-invalid={passwordMismatch}
          aria-describedby={passwordMismatch ? "confirm-password-error" : undefined}
          className="w-full rounded-xl border-none bg-surface-container-low px-4 py-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
        {passwordMismatch ? (
          <p id="confirm-password-error" className="mt-2 text-sm text-red-500">
            {t("passwordMismatch")}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        className="clinical-gradient w-full rounded-xl py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? t("resetting") : t("resetPassword")}
      </button>
    </form>
  );
}
