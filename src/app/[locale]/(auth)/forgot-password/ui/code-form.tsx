"use client";

import { useTranslations } from "next-intl";
import { useMirror } from "../store";

export function CodeForm() {
  const t = useTranslations("auth");
  const token = useMirror("token");
  const setToken = useMirror("setToken");
  const setStep = useMirror("setStep");
  const setError = useMirror("setError");
  const trimmedToken = token.trim();
  const tokenIsValid = trimmedToken.length >= 1;
  const canSubmit = tokenIsValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!tokenIsValid) {
      setError(t("invalidCode"));
      return;
    }
    setStep("newPassword");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="token"
          className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary"
        >
          {t("verificationCode")}
        </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          autoComplete="one-time-code"
          className="w-full rounded-xl border-none bg-surface-container-low px-4 py-4 text-center text-lg tracking-[0.25em] transition-all focus:bg-surface-container-lowest focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          placeholder={t("verificationCodePlaceholder")}
        />
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        className="clinical-gradient w-full rounded-xl py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("verifyCode")}
      </button>
    </form>
  );
}
