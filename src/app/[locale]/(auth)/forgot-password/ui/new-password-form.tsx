"use client";

import { extractErrorMessage } from "@/lib/error";
import { useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import { authModuleNames, } from "@/modules/auth";
import { AuthFrontendService } from "@/modules/auth/frontend/service";
import { AuthPasswordField } from "@/components/ui/auth-password-field";
import { useMirror } from "../store";

const passwordInputClassName =
  "w-full rounded-xl border-none bg-surface-container-low px-4 py-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

const authService = frontendContainer.get<AuthFrontendService>(authModuleNames.service);

export function NewPasswordForm() {
  const t = useTranslations("auth");
  const email = useMirror("email");
  const token = useMirror("token");
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
      await authService.ResetPassword({
        email,
        token: token.trim(),
        newPassword,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(extractErrorMessage(err, t("resetError")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthPasswordField
        id="newPassword"
        label={t("newPassword")}
        inputClassName={passwordInputClassName}
        value={newPassword}
        onValueChange={setNewPassword}
        required
        autoComplete="new-password"
        minLength={6}
      />
      <div>
        <AuthPasswordField
          id="confirmNewPassword"
          label={t("confirmPassword")}
          inputClassName={passwordInputClassName}
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          required
          autoComplete="new-password"
          minLength={6}
          aria-invalid={passwordMismatch}
          aria-describedby={passwordMismatch ? "confirm-password-error" : undefined}
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
        {t("resetPassword")}
      </button>
    </form>
  );
}
