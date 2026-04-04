"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Full-width segmented control (e.g. mobile drawer) */
  stretch?: boolean;
};

export function LocaleSwitcher({ className, stretch }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: string) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-low p-1 text-xs font-semibold",
        stretch && "w-full rounded-xl p-1.5",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "rounded-md px-2 py-1 uppercase transition-colors",
            stretch && "min-h-9 flex-1 rounded-full px-3 py-2 text-[11px] font-bold tracking-wide",
            locale === loc
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-high",
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
