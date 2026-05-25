"use client";

import { extractErrorMessage } from "@/lib/error";
import { useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import { authModuleNames, } from "@/modules/auth";
import { useMirror } from "../store";
import { AuthFrontendService } from "@/modules/auth/frontend/service";

const authService = frontendContainer.get<AuthFrontendService>(authModuleNames.service);

export function IdentifierForm() {
  const t = useTranslations("auth");
  const email = useMirror("email");
  const setEmail = useMirror("setEmail");
  const setStep = useMirror("setStep");
  const setError = useMirror("setError");
  const loading = useMirror("loading");
  const setLoading = useMirror("setLoading");
  const canSubmit = email.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.ForgotPassword({ email });
      setStep("code");
    } catch (err: unknown) {
      setError(extractErrorMessage(err, t("sendCodeError")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary"
        >
          {t("emailOrMobile")}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border-none bg-surface-container-low px-4 py-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          placeholder={t("identifierPlaceholder")}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="clinical-gradient w-full rounded-xl py-4 font-headline font-bold text-on-primary shadow-lg shadow-primary/20 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? t("sending") : t("sendCode")}
      </button>
    </form>
  );
}
