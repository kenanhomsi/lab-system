"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function PartnersStrip() {
  const t = useTranslations("landing.partners");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label"), icon: "science" },
    { value: t("stat2Value"), label: t("stat2Label"), icon: "category" },
    { value: t("stat3Value"), label: t("stat3Label"), icon: "location_on" },
    { value: t("stat4Value"), label: t("stat4Label"), icon: "support_agent" },
  ] as const;

  // Extract prefix, number, and suffix from string value like "1000+" or "24/7"
  const parseValue = (str: string) => {
    const match = str.match(/(\d+)/);
    if (match) {
      const number = parseInt(match[0], 10);
      const index = match.index || 0;
      const prefix = str.substring(0, index);
      const suffix = str.substring(index + match[0].length);
      return { prefix, number, suffix };
    }
    return { prefix: "", number: 0, suffix: str };
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-surface py-16 md:py-24 border-y border-outline-variant/20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-64 w-64 bg-primary/5 inset-s-[10%] top-[20%]" />
        <div className="bg-orb bg-orb-reverse h-72 w-72 bg-secondary/5 inset-e-[5%] bottom-[10%]" />
      </div>
      <div className="relative mx-auto max-w-screen-xl px-6 md:px-8">
        <p
          className="reveal-up mb-12 text-center text-xs font-black uppercase tracking-[0.2em] text-outline"
          style={{ animationDelay: "80ms" }}
        >
          {t("statsEyebrow")}
        </p>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((s, i) => {
            const { prefix, number, suffix } = parseValue(s.value);
            return (
              <div
                key={s.label}
                className="reveal-up flex flex-col items-center justify-center rounded-3xl bg-surface-container-lowest p-8 text-center shadow-sm ring-1 ring-outline-variant/30 transition-all hover:-translate-y-1 hover:bg-surface-container-low hover:shadow-md hover:ring-primary/20"
                style={{ animationDelay: `${160 + i * 80}ms` }}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name={s.icon} size="lg" />
                </div>
                <div className="text-4xl font-black tracking-tighter text-on-surface">
                  {isInView ? (
                    <CountUp
                      end={number}
                      duration={2.5}
                      separator=","
                      prefix={prefix}
                      suffix={suffix}
                    />
                  ) : (
                    prefix + "0" + suffix
                  )}
                </div>
                <div className="mt-2 text-sm font-bold tracking-wide text-on-surface-variant">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
