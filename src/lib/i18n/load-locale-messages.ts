type LocaleMessages = Record<string, unknown>;

export async function loadLocaleMessages(locale: string): Promise<LocaleMessages> {
  const loadedMessages = (await import(`../../../messages/${locale}.json`))
    .default as LocaleMessages;
  const fallbackMessages =
    locale === "en"
      ? loadedMessages
      : ((await import("../../../messages/en.json")).default as LocaleMessages);

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
    ...fallbackMessages,
    ...loadedMessages,
    navbar:
      loadedMessages?.navbar ?? fallbackMessages?.navbar ?? navbarFallback,
  };
}
