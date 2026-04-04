import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";

const SUPPORT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1nIX8y634a1D7lit6BhJOzYhLZA2TvSvqnPlUOaV3qKfa24Cyvhn6g812VcwQJUW6VnLS7MDlmjDAXTFis36PZCgrBBWsh3GxqbBU6eK2IyTyN2ZhWMoKQ35BW9S5b8yVzoJGPBy5ZgA3wplPxEJ67hc0ky4KSGMDkQdkVr2c-0X3XBoG44ZVoCpLrUdgT59CplTVHfsKvTIonIwZqG4fEeRJ26vdukVfeBZv3qoQfbva_FBSAwHcKBeNUS1sleEVuYgj_HGs6UxZ";

export function SupportCard() {
  const t = useTranslations("dashboard.main");

  return (
    <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold font-headline">
        <Icon name="contact_support" className="text-primary" size="sm" />
        {t("supportTitle")}
      </h2>
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
          <Image
            src={SUPPORT_IMG}
            alt={t("supervisor")}
            width={48}
            height={48}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
        <div>
          <p className="text-sm font-bold">{t("supervisor")}</p>
          <p className="text-xs text-on-surface-variant">{t("supervisorName")}</p>
        </div>
      </div>
      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 py-3 text-sm font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <Icon name="call" className="text-lg text-primary" size="sm" />
          {t("callExt")}
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
        >
          <Icon name="chat_bubble" className="text-lg" size="sm" />
          {t("chat")}
        </button>
      </div>
    </section>
  );
}
