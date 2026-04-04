import "reflect-metadata";
import "./globals.css";
import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { routing } from "@/i18n/routing";

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

const qomraArabic = localFont({
  src: [
    {
      path: "../../fonts/itfQomraArabic-sub--6tmlv9/itfQomraArabic-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/itfQomraArabic-sub--6tmlv9/itfQomraArabic-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/itfQomraArabic-sub--6tmlv9/itfQomraArabic-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-qomra-arabic",
  display: "swap",
});

async function resolveLocale(): Promise<string> {
  const locales = routing.locales as readonly string[];
  const isValid = (v: string | undefined | null) =>
    !!v && locales.includes(v);

  const headersList = await headers();
  const headerLocale = headersList.get("x-next-intl-locale");
  if (isValid(headerLocale)) {
    return headerLocale!;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (isValid(cookieLocale)) {
    return cookieLocale!;
  }

  return routing.defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await resolveLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${plusJakarta.variable} ${qomraArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
        />
      </head>
      <body
        className={
          locale === "ar"
            ? "min-h-full flex flex-col bg-background text-on-surface [font-family:var(--font-qomra-arabic),system-ui,sans-serif]"
            : "min-h-full flex flex-col bg-background text-on-surface"
        }
      >
        {children}
      </body>
    </html>
  );
}
