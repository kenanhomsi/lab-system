import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { GlassCard } from "@/components/ui/glass-card";

const FEATURE =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80";

export async function AboutHeritageTimeline() {
  const t = await getTranslations("aboutPage.pillars");
  const pillars = [
    {
      icon: "flag" as const,
      title: t("missionTitle"),
      body: t("missionBody"),
    },
    {
      icon: "visibility" as const,
      title: t("visionTitle"),
      body: t("visionBody"),
    },
    {
      icon: "mail" as const,
      title: t("messageTitle"),
      body: t("messageBody"),
    },
  ];

  return (
    <section className="overflow-hidden bg-surface-container-low py-20 md:py-32">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="reveal-up relative" style={{ animationDelay: "100ms" }}>
            <div className="absolute -end-12 -top-12 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
            <h2 className="mb-10 font-headline text-4xl font-black leading-tight tracking-tight md:mb-12 md:text-5xl">
              {t("title1")} <br />
              {t("title2")} <br />
              {t("title3")}
            </h2>
            <div className="space-y-10 md:space-y-12">
              {pillars.map((m) => (
                <div key={m.title} className="group flex gap-6 md:gap-8">
                  <div className="shrink-0">
                    <Icon
                      name={m.icon}
                      filled
                      className="text-3xl text-primary/30 transition-colors group-hover:text-primary"
                    />
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-bold">{m.title}</h4>
                    <p className="text-sm leading-relaxed text-on-surface-variant">
                      {m.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-up relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl" style={{ animationDelay: "220ms" }}>
            <Image
              src={FEATURE}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <GlassCard className="absolute bottom-6 start-6 end-6 border border-white/40 p-6 md:bottom-8 md:start-8 md:end-8">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-tertiary">
                <Icon name="star" filled className="!text-sm" size="sm" />
                {t("quoteBadge")}
              </div>
              <p className="text-sm italic text-on-surface">{t("quote")}</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
