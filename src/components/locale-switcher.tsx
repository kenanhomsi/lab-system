"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Full-width segmented control (e.g. mobile drawer) */
  stretch?: boolean;
};

/**
 * Language toggle used across the public site and dashboard.
 */
export function LocaleSwitcher({ className, stretch }: Props) {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const groupLabel = t("languageSwitcher");

  const switchLocale = (next: string) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-low p-1 text-xs font-semibold max-[30rem]:gap-0.5 max-[30rem]:p-0.5",
        stretch && "w-full rounded-xl p-1.5",
        className,
      )}
      role="group"
      aria-label={groupLabel}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          suppressHydrationWarning
          onClick={() => switchLocale(loc)}
          aria-pressed={locale === loc}
          className={cn(
            "rounded-md px-2 py-1 uppercase transition-colors max-[30rem]:px-1.5 max-[30rem]:text-[10px]",
            stretch && "min-h-9 flex-1 rounded-full px-3 py-2 text-[11px] font-bold tracking-wide",
            locale === loc
              ? "bg-[#009cc2] text-white shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-high",
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
