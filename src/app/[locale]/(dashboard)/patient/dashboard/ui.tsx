"use client";

import type { CSSProperties } from "react";
import {
  FiActivity,
  FiArrowDown,
  FiArrowRight,
  FiArrowUp,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { useMirror } from "./store";
import type { StatCard } from "./type";
import { PromoBanner } from "@/components/dashboard/promo-banner";
import { SlideCardsDashboard } from "../../../(website)/ui/landing/slide-cards-section";
import styles from "./styles.module.scss";

const STAT_ICONS = {
  calendar: FiCalendar,
  check: FiCheckCircle,
  activity: FiActivity,
} as const;

const RESULT_STATUS_CLASS: Record<"ready" | "processing" | "scheduled", string> = {
  ready: styles.resultReady,
  processing: styles.resultProcessing,
  scheduled: styles.resultScheduled,
};

const StatCardItem = ({ stat }: { stat: StatCard }) => {
  const t = useTranslations("patient.dashboard.stats");
  const locale = useLocale();
  const Icon = STAT_ICONS[stat.iconKey];
  const isUp = stat.trend >= 0;
  const TrendIcon = isUp ? FiArrowUp : FiArrowDown;

  const display = stat.value.toLocaleString(locale);

  return (
    <div className={styles.statCard}>
      <div className={styles.statTop}>
        <div
          className={styles.statIconWrap}
          style={{ background: stat.accentBg, color: stat.accentColor } as CSSProperties}
        >
          <Icon size={20} />
        </div>
        <div className={`${styles.statTrend} ${isUp ? styles.trendUp : styles.trendDown}`}>
          <TrendIcon size={12} />
          <span>
            {stat.trend % 1 === 0 ? Math.abs(stat.trend) : Math.abs(stat.trend).toFixed(1)}%
          </span>
        </div>
      </div>
      <div className={styles.statValue} style={{ color: stat.accentColor } as CSSProperties}>
        {display}
      </div>
      <div className={styles.statLabel}>{t(stat.id)}</div>
      <div className={styles.statBar}>
        <div
          className={styles.statBarFill}
          style={{ width: "65%", background: stat.accentColor } as CSSProperties}
        />
      </div>
    </div>
  );
};

const UI = () => {
  const t = useTranslations("patient.dashboard");
  const locale = useLocale();
  const stats = useMirror("stats");
  const recentResults = useMirror("recentResults");
  const healthSummary = useMirror("healthSummary");
  const activity = useMirror("activity");

  const formatDateOnly = (iso: string) => {
    if (iso === "—") return iso;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(locale, { dateStyle: "medium" });
  };

  return (
    <div className={styles.page}>
      <p className={styles.statLabel} style={{ marginBottom: 12 }}>
        {t("eyebrow")}
      </p>

      <div className={styles.statsRow}>
        {stats.map((stat) => (
          <StatCardItem key={stat.id} stat={stat} />
        ))}
      </div>

      <PromoBanner location="patient_dashboard" />

      <SlideCardsDashboard />

      <div className={styles.midGrid}>
        <div className={styles.healthCard}>
          <h3 className={styles.healthTitle}>{t("healthTitle")}</h3>
          <div className={styles.healthGrid}>
            <div>
              <span className={styles.healthCaption}>{t("healthLastCheckup")}</span>
              <span className={styles.healthBig}>{formatDateOnly(healthSummary.lastCheckup)}</span>
            </div>
            <div>
              <span className={styles.healthCaption}>{t("healthBloodType")}</span>
              <span className={styles.healthBig}>{healthSummary.bloodType}</span>
            </div>
            <div>
              <span className={styles.healthCaption}>{t("healthNextReminder")}</span>
              <span className={styles.healthBig}>{formatDateOnly(healthSummary.nextReminder)}</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t("recentResultsTitle")}</h2>
          <button type="button" className={styles.viewAll}>
            {t("recentViewAll")} <FiArrowRight size={14} />
          </button>
        </div>

        <div className={styles.recentHead}>
          <span>{t("recentCols.test")}</span>
          <span>{t("recentCols.status")}</span>
          <span>{t("recentCols.detail")}</span>
        </div>

        {recentResults.map((row) => (
          <div key={row.id} className={styles.recentRow}>
            <span>{row.testCode}</span>
            <span className={`${styles.statusBadge} ${RESULT_STATUS_CLASS[row.statusVariant]}`}>
              {t(`resultStatus.${row.statusVariant}`)}
            </span>
            <span style={{ fontSize: 13, color: "var(--on-surface-variant)" }}>
              {t(`recent.${row.rowKey}.detail`)}
            </span>
          </div>
        ))}
      </section>

      <section className={styles.activitySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t("activityTitle")}</h2>
        </div>
        {activity.map((item) => (
          <div key={item.id} className={styles.activityRow}>
            <div className={styles.activityDot} />
            <div>
              <div className={styles.activityBody}>{t(`activity.${item.rowKey}.body`)}</div>
              <div className={styles.activityTime}>{t(`activity.${item.rowKey}.time`)}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default UI;
