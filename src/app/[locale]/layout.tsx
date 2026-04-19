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
    en: "Al Mutawali Lab | Doctor System",
    ar: "مخبر المتوالي | نظام الطبيب",
  };
  const descriptions: Record<string, string> = {
    en: "Clinical diagnostics and physician portal",
    ar: "التشخيص السريري وبوابة الطبيب",
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
  const loadedMessages = (await import(`../../../messages/${locale}.json`)).default;
  // Defensive merge to avoid runtime "missing namespace" crashes
  // in case a namespace is omitted by the bundler/serializer.
  const fallbackMessages = locale === "en"
    ? loadedMessages
    : (await import("../../../messages/en.json")).default;
  const messages = {
    ...loadedMessages,
    navbar: loadedMessages?.navbar ?? fallbackMessages?.navbar,
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProviders>{children}</AppProviders>
    </NextIntlClientProvider>
  );
}
