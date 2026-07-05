import localFont from "next/font/local";

/** Primary Arabic typeface used across the public website and RTL UI. */
export const qomraArabic = localFont({
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
