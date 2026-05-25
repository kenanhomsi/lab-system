"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Keeps <html dir/lang> and body locale in sync when locale changes via client navigation. */
export function LocaleHtmlSync() {
  const locale = useLocale();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dataset.localeAr = locale === "ar" ? "true" : "false";
  }, [locale]);

  return null;
}
