"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

const bodyAr =
  "min-h-full flex flex-col bg-background text-on-surface [font-family:var(--font-qomra-arabic),system-ui,sans-serif]";
const bodyEn = "min-h-full flex flex-col bg-background text-on-surface";

/** Keeps <html dir/lang> and body font in sync when locale changes via client navigation. */
export function LocaleHtmlSync() {
  const locale = useLocale();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.className = locale === "ar" ? bodyAr : bodyEn;
  }, [locale]);

  return null;
}
