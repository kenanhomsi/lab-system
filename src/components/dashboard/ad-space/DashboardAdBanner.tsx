"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { DASHBOARD_AD_DEMO_IMAGES } from "./demo-images";
import type { DashboardAdSourceProps } from "./types";
import styles from "./styles.module.scss";

/**
 * Top banner ads. Use `kind="external"` + `partnerName` when the creative is from another business.
 */
export function DashboardAdBanner({ kind = "own", partnerName }: DashboardAdSourceProps = {}) {
  const t = useTranslations("dashboard.ads");
  const [dismissed, setDismissed] = useState(false);
  const isExternal = kind === "external";

  if (dismissed) return null;

  return (
    <div className={styles.banner} role="region" aria-label={t("regionAria")}>
      <div className={styles.bannerInner}>
        <div className={styles.bannerExample}>
          <div className={styles.bannerExampleGlow} aria-hidden />
          <div className={styles.bannerExampleMain}>
            <div className={styles.bannerExampleContent}>
              <span className={styles.bannerExampleBadge}>
                <Icon name={isExternal ? "storefront" : "sell"} size="sm" />
                {isExternal ? t("externalBadge") : t("banner.badge")}
              </span>
              <span className={styles.bannerExampleHeadline}>
                {t("banner.headline")}
              </span>
              <span className={styles.bannerExampleSub}>
                {t("banner.sub")}
              </span>
              {isExternal && partnerName ? (
                <span className={styles.bannerPartnerLine}>
                  {t("sponsoredBy", { partner: partnerName })}
                </span>
              ) : null}
            </div>
            <span className={styles.bannerExampleCta}>{t("banner.cta")}</span>
          </div>
          <div className={styles.bannerExampleMedia}>
            <Image
              src={DASHBOARD_AD_DEMO_IMAGES.banner}
              alt={t("banner.imageAlt")}
              fill
              className={styles.bannerExampleImg}
              sizes="(max-width: 640px) 0px, min(35vw, 220px)"
              priority
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        className={styles.dismissBtn}
        onClick={() => setDismissed(true)}
        aria-label={t("dismissAria")}
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  );
}
