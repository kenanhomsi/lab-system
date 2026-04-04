import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

export async function ContactInfo() {
  const t = await getTranslations("contactPage.info");
  const contactItems = [
    {
      icon: "call" as const,
      title: t("itemShortCode"),
      value: t("shortCodeValue"),
      href: "tel:0119547",
    },
    {
      icon: "smartphone" as const,
      title: t("itemMobile"),
      value: t("mobileValue"),
      href: "tel:0991828342",
    },
    {
      icon: "phone_in_talk" as const,
      title: t("itemLandline"),
      value: t("landlineValue"),
      href: "tel:0113340604",
    },
    {
      icon: "mail" as const,
      title: t("itemEmail"),
      value: t("emailValue"),
      href: "mailto:metwalilab@gmail.com",
    },
    {
      icon: "schedule" as const,
      title: t("itemHours"),
      value: t("hoursValue"),
      href: null as string | null,
    },
    {
      icon: "location_on" as const,
      title: t("itemAddress"),
      value: t("addressValue"),
      href: null as string | null,
    },
  ];

  return (
    <section className="bg-surface-container-low py-16 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="reveal-up mb-16 text-center" style={{ animationDelay: "80ms" }}>
          <span className="text-xs font-black tracking-[0.4em] text-tertiary">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-headline text-4xl font-black md:text-5xl">
            {t("title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contactItems.map((item, i) => {
            const Content = (
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon name={item.icon} className="text-primary" size="sm" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-on-surface-variant">
                    {item.title}
                  </p>
                  <p className="mt-1 text-lg font-bold text-on-surface">
                    {item.value}
                  </p>
                </div>
              </div>
            );

            return (
              <div
                key={item.title}
                className="reveal-up rounded-2xl bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${160 + i * 70}ms` }}
              >
                {item.href ? (
                  <a href={item.href} className="block">
                    {Content}
                  </a>
                ) : (
                  Content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
