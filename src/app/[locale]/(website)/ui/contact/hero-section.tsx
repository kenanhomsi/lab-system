import Image from "next/image";
import { getTranslations } from "next-intl/server";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuALi-mZ6bWnyT6V6AuqMrbu0P8m_nqFZtEX4-jyDjTpgJL_IAfj_VmrGN-Kl5S8W2erJDwjZgsOwAfmoqHhfhAhZWFBGT3iKqVKwLPHJKA_49VgefBCJifUhCCNhqYx6OeT7wFp2ZCMnvardWLgT_gePkj-fCNTLfd0-TNpEb4XozrCKlV4oi2YjLAybr4ViPt7ugR7auP_M5vLn9zJMiFSLGf27vuGoNfJ9NLWIcKLzeLHSKHjt_vUtd-q_wqb50TjfBbkFf_0lWFO";

export async function ContactHeroSection() {
  const t = await getTranslations("contactPage.hero");

  return (
    <section className="relative flex min-h-[500px] items-center overflow-hidden md:min-h-[600px]">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMG}
          alt=""
          fill
          className="object-cover opacity-25"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-8">
        <div className="max-w-3xl">
          <span
            className="reveal-up mb-6 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-bold tracking-[0.2em] text-primary"
            style={{ animationDelay: "100ms" }}
          >
            {t("badge")}
          </span>
          <h1
            className="reveal-up mb-8 font-headline text-5xl font-black leading-[0.95] tracking-tight text-on-surface md:text-7xl"
            style={{ animationDelay: "180ms" }}
          >
            {t("titleLine1")} <br />
            <span className="text-primary">{t("titleAccent")}</span>
          </h1>
          <p
            className="reveal-up max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl"
            style={{ animationDelay: "260ms" }}
          >
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
