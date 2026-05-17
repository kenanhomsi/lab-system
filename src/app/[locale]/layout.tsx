import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppProviders } from "@/components/providers/app-providers";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Al Mutawali Lab",
    ar: "مخبر المتوالي للتحاليل الطبية",
  };
  const descriptions: Record<string, string> = {
    en: "Clinical diagnostics and physician portal",
    ar: " للتحاليل الطبية",
  };
  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  setRequestLocale(locale);
  const loadedMessages = (await import(`../../../messages/${locale}.json`))
    .default;
  // Defensive merge to avoid runtime "missing namespace" crashes
  // in case a namespace is omitted by the bundler/serializer.
  const fallbackMessages =
    locale === "en"
      ? loadedMessages
      : (await import("../../../messages/en.json")).default;
  const navbarFallback = {
    searchPlaceholder: locale === "ar" ? "بحث..." : "Search...",
    notifications: locale === "ar" ? "الإشعارات" : "Notifications",
    help: locale === "ar" ? "المساعدة" : "Help",
    profile: locale === "ar" ? "الملف الشخصي" : "Profile",
    settings: locale === "ar" ? "الإعدادات" : "Settings",
    logout: locale === "ar" ? "تسجيل الخروج" : "Logout",
    lightMode: locale === "ar" ? "الوضع الفاتح" : "Light mode",
    darkMode: locale === "ar" ? "الوضع الداكن" : "Dark mode",
  };
  const messages = {
    ...loadedMessages,
    navbar:
      loadedMessages?.navbar ?? fallbackMessages?.navbar ?? navbarFallback,
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProviders>{children}</AppProviders>
    </NextIntlClientProvider>
  );
}
