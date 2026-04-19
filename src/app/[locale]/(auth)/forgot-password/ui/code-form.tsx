"use client";

import { useTranslations } from "next-intl";
import { useMirror } from "../store";

export function CodeForm() {
  const t = useTranslations("auth");
  const code = useMirror("code");
  const setCode = useMirror("setCode");
  const setStep = useMirror("setStep");
  const setError = useMirror("setError");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (code.length < 4) {
      setError(t("invalidCode"));
      return;
    }
    setStep("newPassword");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="code"
          className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary"
        >
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
  );
}
