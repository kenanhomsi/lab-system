import type { AppLocale } from "@/i18n/routing";
import type { WebsitePageLanguage } from "@/types/website-page";

export const WEBSITE_PAGE_LANGUAGES = ["en-US", "ar"] as const;

export const WEBSITE_PAGE_LANGUAGE_LABELS: Record<WebsitePageLanguage, string> = {
  "en-US": "English",
  ar: "Arabic",
};

export const APP_LOCALE_TO_WEBSITE_PAGE_LANGUAGE: Record<
  AppLocale,
  WebsitePageLanguage
> = {
  en: "en-US",
  ar: "ar",
};

export function toWebsitePageLanguage(locale: string): WebsitePageLanguage {
  return locale === "ar" ? "ar" : "en-US";
}
