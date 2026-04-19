"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { DASHBOARD_AD_DEMO_IMAGES } from "./demo-images";
import type { DashboardAdSourceProps } from "./types";
import styles from "./styles.module.scss";

/**
 * Floating corner ads. Use `kind="external"` + `partnerName` for third-party inventory.
 */
export function DashboardAdFloating({ kind = "own", partnerName }: DashboardAdSourceProps = {}) {
  const t = useTranslations("dashboard.ads");
  const [dismissed, setDismissed] = useState(false);
  const isExternal = kind === "external";

  if (dismissed) return null;

  return (
    <aside
      className={styles.floatingRoot}
      role="complementary"
      aria-label={t("regionAria")}
    >
      <div className={styles.floatingVisual}>
        <Image
          src={DASHBOARD_AD_DEMO_IMAGES.floating}
          alt={t("floating.imageAlt")}
          fill
          className={styles.floatingImg}
          sizes="300px"
        />
      </div>
      <button
        type="button"
        className={styles.floatingDismiss}
        onClick={() => setDismissed(true)}
        aria-label={t("dismissAria")}
      >
        <Icon name="close" size="sm" />
      </button>
      <div className={styles.floatingBody}>
        <div className={styles.floatingBadge}>
          <Icon name={isExternal ? "storefront" : "bolt"} size="sm" />
          {isExternal ? t("externalBadge") : t("floating.badge")}
        </div>
        {isExternal && partnerName ? (
          <p className={styles.floatingPartnerLine}>
            {t("sponsoredBy", { partner: partnerName })}
          </p>
        ) : null}
        <p className={styles.floatingTitle}>{t("floating.title")}</p>
        <p className={styles.floatingDesc}>{t("floating.desc")}</p>
        <span className={styles.floatingCta} role="presentation">
          {t("floating.cta")}
        </span>
        {isExternal ? (
          <p className={styles.floatingDisclaimer}>
            {t("disclaimerShort", { siteName: t("siteName") })}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
