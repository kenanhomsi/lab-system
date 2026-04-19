import "reflect-metadata";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { routing } from "@/i18n/routing";

const MANTINE_COLOR_SCHEME_BOOTSTRAP = `try {
  var _colorScheme = window.localStorage.getItem("color-scheme");
  var colorScheme = _colorScheme === "light" || _colorScheme === "dark" || _colorScheme === "auto" ? _colorScheme : "light";
  var computedColorScheme = colorScheme !== "auto" ? colorScheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-mantine-color-scheme", computedColorScheme);
  if (computedColorScheme === "dark") document.documentElement.classList.add("dark");
} catch (e) {}`;
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
        data-locale-ar={locale === "ar" ? "true" : "false"}
        suppressHydrationWarning
      >
        <Script
          id="mantine-color-scheme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: MANTINE_COLOR_SCHEME_BOOTSTRAP }}
        />
        {children}
      </body>
    </html>
  );
}
