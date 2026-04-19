"use client";

import { useTranslations } from "next-intl";
import { useMirror } from "../store";

export function IdentifierForm() {
  const t = useTranslations("auth");
  const identifier = useMirror("identifier");
  const setIdentifier = useMirror("setIdentifier");
  const setStep = useMirror("setStep");
  const setError = useMirror("setError");
  const loading = useMirror("loading");
  const setLoading = useMirror("setLoading");

  async function handleSubmit(e: React.FormEvent) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="identifier"
          className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary"
        >
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
  );
}
