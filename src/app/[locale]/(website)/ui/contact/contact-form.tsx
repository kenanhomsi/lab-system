import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

export async function ContactForm() {
  const t = await getTranslations("contactPage.form");

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="reveal-up" style={{ animationDelay: "100ms" }}>
            <span className="text-xs font-black tracking-[0.4em] text-tertiary">
              {t("eyebrow")}
            </span>
            <h2 className="mt-4 font-headline text-4xl font-black tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant">
              {t("body")}
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Icon
                  name="check_circle"
                  filled
                  className="text-primary"
                  size="sm"
                />
                <span className="text-sm">{t("check1")}</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Icon
                  name="check_circle"
                  filled
                  className="text-primary"
                  size="sm"
                />
                <span className="text-sm">{t("check2")}</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Icon
                  name="check_circle"
                  filled
                  className="text-primary"
                  size="sm"
                />
                <span className="text-sm">{t("check3")}</span>
              </div>
            </div>
          </div>
          <div className="reveal-up rounded-2xl bg-surface-container-lowest p-8 shadow-xl md:p-10" style={{ animationDelay: "200ms" }}>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-on-surface"
                >
                  {t("nameLabel")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t("namePlaceholder")}
                  suppressHydrationWarning
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-on-surface"
                >
                  {t("phoneLabel")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder={t("phonePlaceholder")}
                  suppressHydrationWarning
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-bold text-on-surface"
                >
                  {t("dateLabel")}
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  suppressHydrationWarning
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label
                  htmlFor="details"
                  className="mb-2 block text-sm font-bold text-on-surface"
                >
                  {t("detailsLabel")}
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  placeholder={t("detailsPlaceholder")}
                  suppressHydrationWarning
                  className="w-full resize-none rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                suppressHydrationWarning
                className="clinical-gradient w-full rounded-xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98]"
              >
                {t("submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
