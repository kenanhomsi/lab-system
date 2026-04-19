"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { DASHBOARD_AD_DEMO_IMAGES } from "./demo-images";
import type { DashboardAdSourceProps } from "./types";
import styles from "./styles.module.scss";

/**
 * Inline card ads. Pass `kind="external"` and `partnerName` when the offer is from another business.
 */
export function DashboardAdCard({ kind = "own", partnerName }: DashboardAdSourceProps = {}) {
  const t = useTranslations("dashboard.ads");
  const [dismissed, setDismissed] = useState(false);
  const isExternal = kind === "external";

  if (dismissed) return null;

  return (
    <section className={styles.card} aria-label={t("regionAria")}>
      <div className={styles.gradientOverlay} aria-hidden />
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <span className={styles.adTitle}>
              {isExternal ? t("externalBadge") : t("ownBadge")}
            </span>
            <span className={styles.sponsoredChip}>{t("card.sponsored")}</span>
          </div>
          {isExternal && partnerName ? (
            <p className={styles.partnerSubline}>
              {t("sponsoredBy", { partner: partnerName })}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          className={styles.cardDismiss}
          onClick={() => setDismissed(true)}
          aria-label={t("dismissAria")}
        >
          <Icon name="close" size="sm" />
        </button>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardExample}>
          <div className={styles.cardExampleCopy}>
            <p className={styles.cardExampleKicker}>{t("card.kicker")}</p>
            <h3 className={styles.cardExampleTitle}>{t("card.heading")}</h3>
            <p className={styles.cardExampleDesc}>{t("card.desc")}</p>
            <span className={styles.cardExampleFakeBtn} role="presentation">
              {t("card.cta")}
            </span>
          </div>
          <div className={styles.cardExampleArt}>
            <Image
              src={DASHBOARD_AD_DEMO_IMAGES.card}
              alt={t("card.imageAlt")}
              fill
              className={styles.cardExampleImg}
              sizes="(max-width: 640px) 100vw, 220px"
            />
          </div>
        </div>
        {isExternal ? (
          <p className={styles.externalDisclaimer}>
            {t("disclaimerExternal", { siteName: t("siteName") })}
          </p>
        ) : null}
      </div>
    </section>
  );
}
