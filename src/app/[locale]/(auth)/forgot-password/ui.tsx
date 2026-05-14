"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useMirror } from "./store";
import { ProgressSteps } from "./ui/progress-steps";
import { SuccessView } from "./ui/success-view";
import { IdentifierForm } from "./ui/identifier-form";
import { CodeForm } from "./ui/code-form";
import { NewPasswordForm } from "./ui/new-password-form";

const UI = () => {
  const step = useMirror("step");
  const error = useMirror("error");
  const success = useMirror("success");
  const locale = useLocale();
  const t = useTranslations("auth");

  if (success) return <SuccessView />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href={`/${locale}`} className="mb-6 inline-flex items-center justify-center">
            <BrandLogo variant="full" />
          </Link>
          <h2 className="mt-4 font-headline text-3xl font-bold">{t("forgotPasswordTitle")}</h2>
          <p className="mt-2 text-sm text-secondary">{t("forgotPasswordDesc")}</p>
        </div>

        <ProgressSteps currentStep={step} />

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {step === "identifier" && <IdentifierForm />}
        {step === "code" && <CodeForm />}
        {step === "newPassword" && <NewPasswordForm />}

        <p className="mt-6 text-center text-sm text-secondary">
          <Link href={`/${locale}/login`} className="font-bold text-primary hover:underline">
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </main>
  );
};

export default UI;
