"use client";

import { useTranslations } from "next-intl";
import { useMirror } from "../store";

export function NewPasswordForm() {
  const t = useTranslations("auth");
  const identifier = useMirror("identifier");
  const code = useMirror("code");
  const newPassword = useMirror("newPassword");
  const setNewPassword = useMirror("setNewPassword");
  const confirmPassword = useMirror("confirmPassword");
  const setConfirmPassword = useMirror("setConfirmPassword");
  const loading = useMirror("loading");
  const setLoading = useMirror("setLoading");
  const setError = useMirror("setError");
  const setSuccess = useMirror("setSuccess");

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
        body: JSON.stringify({ identifier, code, newPassword }),
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
          minLength={6}
          className="w-full rounded-xl border-none bg-surface-container-low py-4 px-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0"
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
  );
}
