"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";

export function SuccessView() {
  const t = useTranslations("auth");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-4 py-8 sm:p-6">
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
