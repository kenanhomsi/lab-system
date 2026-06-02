import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuALi-mZ6bWnyT6V6AuqMrbu0P8m_nqFZtEX4-jyDjTpgJL_IAfj_VmrGN-Kl5S8W2erJDwjZgsOwAfmoqHhfhAhZWFBGT3iKqVKwLPHJKA_49VgefBCJifUhCCNhqYx6OeT7wFp2ZCMnvardWLgT_gePkj-fCNTLfd0-TNpEb4XozrCKlV4oi2YjLAybr4ViPt7ugR7auP_M5vLn9zJMiFSLGf27vuGoNfJ9NLWIcKLzeLHSKHjt_vUtd-q_wqb50TjfBbkFf_0lWFO";

export async function ContactHeroSection() {
  const t = await getTranslations("contactPage.hero");
  const info = await getTranslations("contactPage.info");
  const form = await getTranslations("contactPage.form");

  const quickContacts = [
    {
      icon: "smartphone",
      label: info("itemMobile"),
      value: info("mobileValue"),
      href: "tel:0991828342",
    },
    {
      icon: "schedule",
      label: info("itemHours"),
      value: info("hoursValue"),
      href: null,
    },
    {
      icon: "mail",
      label: info("itemEmail"),
      value: info("emailValue"),
      href: "mailto:metwalilab@gmail.com",
    },
  ] as const;

  const highlights = [form("check1"), form("check2"), form("check3")];

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMG}
          alt=""
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(248,249,252,0.88)_0%,rgba(219,234,254,0.72)_50%,rgba(248,249,252,0.92)_100%)]" />
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[80px]" />
        <div className="absolute -left-24 bottom-0 h-[400px] w-[400px] rounded-full bg-tertiary/[0.06] blur-[80px]" />
        <div className="absolute right-1/4 top-1/3 h-[200px] w-[200px] rounded-full bg-secondary/[0.05] blur-[60px]" />
      </div>

      <div className="relative z-10 content-container w-full py-20 md:py-28 lg:py-32">
        <div className="grid items-start gap-16 lg:grid-cols-[1fr_420px] lg:gap-20">
          <div className="max-w-[680px]">
            <div
              className="reveal-up inline-flex items-center gap-3 rounded-full border border-primary/20 bg-white/70 px-5 py-2.5 shadow-sm backdrop-blur-md"
              style={{ animationDelay: "80ms" }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" />
              </span>
              <span className="text-xs font-black tracking-[0.28em] text-primary uppercase">
                {t("badge")}
              </span>
            </div>

            <h1
              className="reveal-up mt-8 font-headline text-6xl font-black leading-[0.9] tracking-tight text-on-surface md:text-7xl lg:text-8xl"
              style={{ animationDelay: "160ms" }}
            >
              {t("titleLine1")}{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("titleAccent")}
              </span>
            </h1>

            <p
              className="reveal-up mt-8 max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl"
              style={{ animationDelay: "240ms" }}
            >
              {t("description")}
            </p>

            <div
              className="reveal-up mt-10 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "320ms" }}
            >
              <a
                href="#contact-request"
                className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 rounded-2xl border border-white/10" />
                <Icon name="calendar_month" size="sm" />
                {t("primaryCta")}
                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  →
                </span>
              </a>
              <a
                href="#branch-locations"
                className="group inline-flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-white/80 px-7 py-4 text-sm font-bold text-on-surface shadow-lg shadow-slate-950/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
              >
                <Icon name="location_on" size="sm" />
                {t("secondaryCta")}
              </a>
            </div>

            <div
              className="reveal-up mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              style={{ animationDelay: "400ms" }}
            >
              {highlights.map((item) => (
                <div
                  key={item}
                  className="group flex items-start gap-4 rounded-2xl border border-outline-variant/20 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-sm">
                    <Icon name="check_circle" filled size="sm" />
                  </div>
                  <p className="text-sm leading-6 font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="reveal-up hidden lg:block"
            style={{ animationDelay: "240ms" }}
          >
            <div className="sticky top-28 space-y-4">
              <div className="relative rounded-3xl border border-white/50 bg-white/80 shadow-2xl shadow-slate-950/8 backdrop-blur-xl">
                <div className="absolute inset-x-0 top-0 rounded-t-3xl h-1 bg-gradient-to-r from-primary via-secondary to-tertiary" />
                <div className="p-8">
                  <p className="text-[10px] font-black tracking-[0.35em] text-primary uppercase">
                    {info("eyebrow")}
                  </p>
                  <p className="mt-2 font-headline text-2xl font-black tracking-tight text-on-surface">
                    {info("title")}
                  </p>

                  <div className="mt-7 space-y-3">
                    {quickContacts.map((item) => {
                      const content = (
                        <div className="group flex items-center gap-4 rounded-2xl border border-outline-variant/15 bg-surface p-4 transition-all duration-300 hover:border-primary/25 hover:bg-primary/[0.03]">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/12 to-primary/5 text-primary shadow-sm">
                            <Icon
                              name={item.icon}
                              filled={item.icon === "mail"}
                              size="sm"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black tracking-[0.22em] text-on-surface-variant uppercase">
                              {item.label}
                            </p>
                            <p className="mt-0.5 truncate text-sm font-bold text-on-surface">
                              {item.value}
                            </p>
                          </div>
                          {item.href ? (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <Icon name="arrow_forward" size="sm" />
                            </div>
                          ) : null}
                        </div>
                      );
                      return item.href ? (
                        <a key={item.label} href={item.href} className="block">
                          {content}
                        </a>
                      ) : (
                        <div key={item.label}>{content}</div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-2xl bg-gradient-to-r from-primary/[0.08] to-secondary/[0.06] border border-primary/15 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black tracking-[0.28em] text-primary uppercase">
                          {info("itemShortCode")}
                        </p>
                        <p className="mt-1 font-headline text-3xl font-black text-on-surface tracking-tight">
                          {info("shortCodeValue")}
                        </p>
                      </div>
                      <a
                        href="tel:0119547"
                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-primary shadow-sm transition-all duration-300 hover:bg-primary hover:text-white"
                      >
                        <Icon name="call" size="sm" />
                        {info("itemLandline")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-2xl border border-outline-variant/15 bg-white/50 px-4 py-3 shadow-sm backdrop-blur">
                <div className="flex -space-x-2">
                  {["avatar1", "avatar2", "avatar3"].map((_, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white shadow"
                    >
                      {["م", "أ", "س"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant">
                  <span className="font-bold text-on-surface">+500</span>{" "}
                  {t("socialProof")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
