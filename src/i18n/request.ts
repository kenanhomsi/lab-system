import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "ar")) {
    locale = routing.defaultLocale;
  }

  const loadedMessages = (await import(`../../messages/${locale}.json`)).default;
  const fallbackMessages =
    locale === "en"
      ? loadedMessages
      : (await import("../../messages/en.json")).default;

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

  return {
    locale,
    messages: {
      ...fallbackMessages,
      ...loadedMessages,
      navbar: loadedMessages?.navbar ?? fallbackMessages?.navbar ?? navbarFallback,
    },
  };
});
