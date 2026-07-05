"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import styles from "../scss/lab-panel.module.scss";

const LAB_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAgPaAIIx7njrMnEVYy8-R1T3bk9Nbf31gTF-hlWWidQj-mW2tcPGjE1vFpSw--fFVux3eEiOK0X8rUqTWSvpWPSMZ3Hhs1yehQeVNMg__0Uof0cXmc6i_3TEiJwTfbnQTp0W_MlH2XnLvPOMpqkdx7f8RwvJvBeXJ87ekjDyoWAnCOK9h-uJSXQ3AaqJSHgMSrn3etOpiSnCRTFjan4nRuE2G3j8al5rtK-s0z-NZyAZxur5AP7eq8TXHtIamTd1c4XyZ2KkrklOlS";

/**
 * Decorative lab panel shown beside the login form.
 */
export function LabPanel() {
  const t = useTranslations("auth.labPanel");

  return (
    <section className={styles.labSection}>
      <div className={styles.labBg}>
        <Image
          src={LAB_IMG}
          alt=""
          fill
          className={styles.labImage}
          priority
          unoptimized
        />
        <div className={styles.labGradient} />
      </div>
      <div className={styles.labContent}>
        <div className={styles.labBadge}>
          <Icon
            name="workspace_premium"
            filled
            className={styles.labBadgeIcon}
            size="sm"
          />
          <span className={styles.labBadgeText}>{t("badge")}</span>
        </div>
        <h1 className={styles.labTitle}>
          {t("titleBefore")}{" "}
          <span className={styles.labTitleAccent}>{t("titleAccent")}</span>
          {t("titleAfter")}
        </h1>
        <p className={styles.labDescription}>{t("description")}</p>
        <div className={styles.labStats}>
          <div className={styles.labStat}>
            <span className={styles.labStatValue}>{t("accuracyValue")}</span>
            <span className={styles.labStatLabel}>{t("accuracy")}</span>
          </div>
          <div className={styles.labDivider} />
          <div className={styles.labStat}>
            <span className={styles.labStatValue}>{t("turnaroundValue")}</span>
            <span className={styles.labStatLabel}>{t("turnaround")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
