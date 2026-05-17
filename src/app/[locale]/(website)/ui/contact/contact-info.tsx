import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";

export async function ContactInfo() {
  const t = await getTranslations("contactPage.info");
  const contactItems = [
    {
      icon: "smartphone" as const,
      title: t("itemMobile"),
      value: t("mobileValue"),
      href: "tel:0991828342",
      featured: true,
      helper: t("hoursValue"),
    },
    {
      icon: "call" as const,
      title: t("itemShortCode"),
      value: t("shortCodeValue"),
      href: "tel:0119547",
      helper: t("itemLandline"),
    },
    {
      icon: "phone_in_talk" as const,
      title: t("itemLandline"),
      value: t("landlineValue"),
      href: "tel:0113340604",
      helper: t("itemShortCode"),
    },
    {
      icon: "mail" as const,
      title: t("itemEmail"),
      value: t("emailValue"),
      href: "mailto:metwalilab@gmail.com",
      helper: t("addressValue"),
    },
    {
      icon: "schedule" as const,
      title: t("itemHours"),
      value: t("hoursValue"),
      href: null,
      helper: `${t("itemMobile")}: ${t("mobileValue")}`,
    },
    {
      icon: "location_on" as const,
      title: t("itemAddress"),
      value: t("addressValue"),
      href: "https://www.openstreetmap.org/?mlat=33.5192&mlon=36.2878#map=17/33.5192/36.2878",
      helper: t("hoursValue"),
    },
  ];

  return (
    <section
      id="contact-details"
      className="relative overflow-hidden bg-surface py-20 md:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.06),transparent)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" />

      <div className="relative mx-auto max-w-screen-2xl px-6 md:px-8">
        <div
          className="reveal-up mb-14 md:mb-20"
          style={{ animationDelay: "80ms" }}
        >
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            action={
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex items-center gap-2 rounded-2xl border border-outline-variant/20 bg-white px-5 py-3 shadow-sm">
                  <Icon name="schedule" className="text-primary" size="sm" />
                  <div>
                    <p className="text-[10px] font-black tracking-[0.22em] text-on-surface-variant uppercase">
                      {t("itemHours")}
                    </p>
                    <p className="font-headline text-base font-bold text-on-surface">
                      {t("hoursValue")}
                    </p>
                  </div>
                </div>
              </div>
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-12">
          {contactItems.map((item, i) => {
            const content = (
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <div
                    className={
                      item.featured
                        ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg shadow-primary/20"
                        : "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-sm"
                    }
                  >
                    <Icon
                      name={item.icon}
                      className={item.featured ? "text-white" : "text-primary"}
                      size="sm"
                    />
                  </div>
                  {item.href && (
                    <div
                      className={
                        item.featured
                          ? "flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white"
                          : "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      }
                    >
                      <Icon name="arrow_outward" size="sm" />
                    </div>
                  )}
                </div>

                <div className="mt-7">
                  <p
                    className={
                      item.featured
                        ? "text-[10px] font-black tracking-[0.32em] text-white/70 uppercase"
                        : "text-[10px] font-black tracking-[0.32em] text-on-surface-variant uppercase"
                    }
                  >
                    {item.title}
                  </p>
                  <p
                    className={
                      item.featured
                        ? "mt-3 font-headline text-4xl font-black tracking-tight text-white md:text-5xl"
                        : "mt-2 font-headline text-2xl font-black tracking-tight text-on-surface"
                    }
                  >
                    {item.value}
                  </p>
                </div>

                <div className="mt-auto pt-7">
                  <div
                    className={
                      item.featured
                        ? "inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white/80"
                        : "inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2 text-xs font-medium text-on-surface-variant"
                    }
                  >
                    <Icon name="info" size="sm" />
                    {item.helper}
                  </div>
                </div>
              </div>
            );

            const cardClass = item.featured
              ? "rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 p-8 text-white shadow-2xl shadow-primary/20 md:p-10"
              : "rounded-[1.75rem] border border-outline-variant/15 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl";

            return (
              <article
                key={item.title}
                className={`reveal-up ${item.featured ? "xl:col-span-5" : "xl:col-span-3"}`}
                style={{ animationDelay: `${160 + i * 70}ms` }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.icon === "location_on" ? "_blank" : undefined}
                    rel={
                      item.icon === "location_on"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`block h-full ${cardClass}`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={`h-full ${cardClass}`}>{content}</div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
