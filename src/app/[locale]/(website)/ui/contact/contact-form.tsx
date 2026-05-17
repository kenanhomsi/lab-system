"use client";

import { DateTimePicker } from "@mantine/dates";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";

const INPUT_CLASS =
  "w-full rounded-2xl border border-outline-variant/20 bg-white px-4 py-4 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const info = useTranslations("contactPage.info");

  const serviceHighlights = [t("check1"), t("check2"), t("check3")];
  const reassuranceItems = [
    { icon: "schedule", label: info("itemHours"), value: info("hoursValue") },
    {
      icon: "smartphone",
      label: info("itemMobile"),
      value: info("mobileValue"),
    },
    {
      icon: "call",
      label: info("itemShortCode"),
      value: info("shortCodeValue"),
    },
  ];

  return (
    <section
      id="contact-request"
      className="relative overflow-hidden bg-gradient-to-b from-surface via-surface to-surface-container-low py-20 md:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(59,130,246,0.05),transparent)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="absolute -right-20 top-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[100px]" />
      </div>
      <div className="absolute -left-20 bottom-0">
        <div className="h-[400px] w-[400px] rounded-full bg-tertiary/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1fr_520px] lg:gap-16">
          <div
            className="reveal-up lg:sticky lg:top-28"
            style={{ animationDelay: "80ms" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-[10px] font-black tracking-[0.32em] text-primary uppercase">
              <Icon name="bolt" size="sm" />
              {t("eyebrow")}
            </span>

            <h2 className="mt-5 max-w-xl font-headline text-5xl font-black tracking-tight text-on-surface md:text-6xl lg:text-[4rem]">
              {t("title")}
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant">
              {t("body")}
            </p>

            <div className="mt-10 space-y-4">
              {serviceHighlights.map((item, index) => (
                <div
                  key={item}
                  className="group flex items-start gap-5 rounded-2xl border border-outline-variant/15 bg-white/80 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/12 to-primary/5 text-primary shadow-sm">
                    <Icon
                      name={
                        index === 0
                          ? "home_health"
                          : index === 1
                            ? "biotech"
                            : "description"
                      }
                      size="md"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-semibold leading-6 text-on-surface">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {reassuranceItems.map((item) => (
                <div
                  key={item.label}
                  className="group rounded-2xl border border-outline-variant/15 bg-white/80 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-tertiary/12 to-tertiary/5 text-tertiary shadow-sm">
                    <Icon name={item.icon} size="sm" />
                  </div>
                  <p className="mt-4 text-[10px] font-black tracking-[0.28em] text-on-surface-variant uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 font-headline text-base font-bold text-on-surface">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="reveal-up relative"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative rounded-[2rem] border border-outline-variant/15 bg-white shadow-2xl shadow-slate-950/6 overflow-hidden">
              <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary" />

              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.04),transparent)]" />

              <div className="relative p-8 md:p-10">
                <div className="mb-8 flex items-center gap-4 rounded-2xl border border-outline-variant/15 bg-surface-container-low/60 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                    <Icon name="support_agent" size="sm" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-[0.22em] text-primary uppercase">
                      {info("itemHours")}
                    </p>
                    <p className="mt-0.5 font-headline text-base font-bold text-on-surface">
                      {info("hoursValue")}
                    </p>
                  </div>
                </div>

                <form className="mt-4 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2.5 block text-xs font-bold tracking-[0.08em] text-on-surface uppercase"
                      >
                        {t("nameLabel")}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder={t("namePlaceholder")}
                        suppressHydrationWarning
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2.5 block text-xs font-bold tracking-[0.08em] text-on-surface uppercase"
                      >
                        {t("phoneLabel")}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder={t("phonePlaceholder")}
                        suppressHydrationWarning
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="mb-2.5 block text-xs font-bold tracking-[0.08em] text-on-surface uppercase"
                    >
                      {t("dateLabel")}
                    </label>
                    <DateTimePicker
                      id="date"
                      name="date"
                      placeholder={t("datePlaceholder")}
                      valueFormat="MM/DD/YYYY hh:mm A"
                      clearable
                      classNames={{
                        label: "hidden",
                        input: INPUT_CLASS,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="details"
                      className="mb-2.5 block text-xs font-bold tracking-[0.08em] text-on-surface uppercase"
                    >
                      {t("detailsLabel")}
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      rows={4}
                      placeholder={t("detailsPlaceholder")}
                      suppressHydrationWarning
                      className={`${INPUT_CLASS} min-h-36 resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    suppressHydrationWarning
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/85 px-8 py-5 text-sm font-bold tracking-[0.12em] text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-secondary opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="relative flex items-center justify-center gap-3">
                      <Icon name="send" size="sm" />
                      {t("submit")}
                      <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                        →
                      </span>
                    </span>
                  </button>

                  <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-low/60 p-4">
                    <p className="text-center text-xs leading-6 text-on-surface-variant">
                      {info("itemMobile")}:{" "}
                      <a
                        href={`tel:${info("mobileValue")}`}
                        className="font-bold text-primary hover:underline"
                      >
                        {info("mobileValue")}
                      </a>{" "}
                      · {info("itemLandline")}:{" "}
                      <a
                        href={`tel:${info("landlineValue")}`}
                        className="font-bold text-primary hover:underline"
                      >
                        {info("landlineValue")}
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
