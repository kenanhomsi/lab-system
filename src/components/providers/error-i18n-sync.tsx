"use client";

import { setErrorLabels } from "@/lib/error/error-labels";
import { useTranslations } from "next-intl";

/**
 * Keeps global error toasts and fallbacks aligned with the active next-intl locale.
 */
export function ErrorI18nSync() {
  const t = useTranslations("errors");

  setErrorLabels({
    fetchErrorTitle: t("fetchErrorTitle"),
    operationFailedTitle: t("operationFailedTitle"),
    genericFallback: t("genericFallback"),
    alertTitle: t("alertTitle"),
  });

  return null;
}
