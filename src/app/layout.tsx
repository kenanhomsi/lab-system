import "reflect-metadata";
import "./globals.css";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Inter, Plus_Jakarta_Sans, Geist } from "next/font/google";
import { routing } from "@/i18n/routing";
import { qomraArabic } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

function resolveLocaleFromPathname(pathname: string | null): string {
  const matched = pathname?.match(/^\/(en|ar)(?:\/|$)/)?.[1];
  if (matched && routing.locales.includes(matched as "en" | "ar")) {
    return matched;
  }
  return routing.defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname");
  const locale = resolveLocaleFromPathname(pathname);
  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={cn(
        "min-h-full antialiased font-sans",
        isArabic && qomraArabic.variable,
        !isArabic && inter.variable,
        !isArabic && plusJakarta.variable,
        !isArabic && geist.variable,
      )}
      suppressHydrationWarning
    >
      <body
        data-locale-ar={isArabic ? "true" : "false"}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
