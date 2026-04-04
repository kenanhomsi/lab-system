"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export function LocaleSwitcher({ className }: Props) {
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
            locale === loc
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:bg-surface-container-high",
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
