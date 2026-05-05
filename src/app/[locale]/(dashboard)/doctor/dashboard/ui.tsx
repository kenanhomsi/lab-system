"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import {
  FiActivity,
  FiArrowDown,
  FiArrowRight,
  FiArrowUp,
  FiCalendar,
  FiMoreHorizontal,
  FiUsers,
} from "react-icons/fi";
import { BarChart } from "@mantine/charts";
import { useLocale, useTranslations } from "next-intl";
import { useMirror } from "./store";
import type { StatCard } from "./type";
import { PromoBanner } from "@/components/dashboard/promo-banner";
import { SlideCardsDashboard } from "../../../(website)/ui/landing/slide-cards-section";
import styles from "./styles.module.scss";

const STAT_ICONS = {
  users: FiUsers,
  calendar: FiCalendar,
  activity: FiActivity,
} as const;

const REFERRAL_STATUS_CLASS: Record<"pending" | "urgent", string> = {
  pending: styles.refPending,
  urgent: styles.refUrgent,
};

const StatCardItem = ({ stat }: { stat: StatCard }) => {
  const t = useTranslations("doctor.dashboard.stats");
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
  const t = useTranslations("doctor.dashboard");
  const locale = useLocale();
  const stats = useMirror("stats");
  const pendingReferrals = useMirror("pendingReferrals");
  const recentPatients = useMirror("recentPatients");
  const weeklySummary = useMirror("weeklySummary");

  const chartData = useMemo(
    () =>
      weeklySummary.map((row) => ({
        day: t(`chartDays.${row.dayKey}`),
        value: row.value,
      })),
    [weeklySummary, t],
  );

  const formatDate = (iso: string) => {
    if (iso === "—") return iso;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(locale, { dateStyle: "medium" });
  };

  return (
    <div className={styles.page}>
      <div className={styles.shellGrid}>
        <section className={styles.mainColumn}>
          <PromoBanner location="doctor_dashboard" />

          <article className={styles.heroCard}>
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>{t("eyebrow")}</p>
              <h1 className={styles.heroTitle}>{t("chartTitle")}</h1>
              <p className={styles.heroSubtitle}>{t("chartSubtitle")}</p>
            </div>
            <div className={styles.heroStats}>
              {stats.map((stat) => (
                <div key={stat.id} className={styles.heroStatPill}>
                  <span>{t(`stats.${stat.id}`)}</span>
                  <strong>{stat.value.toLocaleString(locale)}</strong>
                </div>
              ))}
            </div>
          </article>

          <div className={styles.statsRow}>
            {stats.map((stat) => (
              <StatCardItem key={stat.id} stat={stat} />
            ))}
          </div>

          <div className={styles.midGrid}>
            <div className={styles.glassCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.midTitle}>{t("referralsTitle")}</h3>
                <span className={styles.liveChip}>{t("eyebrow")}</span>
              </div>
              <p className={styles.midSub}>{t("referralsSubtitle")}</p>
              <div className={styles.referralList}>
                {pendingReferrals.map((ref) => (
                  <div key={ref.id} className={styles.referralRow}>
                    <div className={styles.referralMain}>
                      <div className={styles.referralPatient}>{ref.patientName}</div>
                      <div className={styles.referralTests}>{ref.testSummary}</div>
                      <div className={styles.referralTests}>{t(`referrals.${ref.rowKey}.note`)}</div>
                    </div>
                    <span className={`${styles.statusBadge} ${REFERRAL_STATUS_CLASS[ref.statusVariant]}`}>
                      {t(`referralStatus.${ref.statusVariant}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.glassCard}>
              <h3 className={styles.midTitle}>{t("chartTitle")}</h3>
              <p className={styles.midSub}>{t("chartSubtitle")}</p>
              <BarChart
                h={220}
                data={chartData}
                dataKey="day"
                series={[{ name: "value", color: "var(--primary)" }]}
                barProps={{ radius: [6, 6, 0, 0] }}
                tickLine="none"
                gridAxis="none"
              />
            </div>
          </div>

          <section className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t("recentTitle")}</h2>
              <button type="button" className={styles.viewAll}>
                {t("recentViewAll")} <FiArrowRight size={14} />
              </button>
            </div>
            <div className={styles.recentHead}>
              <span>{t("recentCols.patient")}</span>
              <span>{t("recentCols.lastVisit")}</span>
              <span>{t("recentCols.notes")}</span>
            </div>
            {recentPatients.map((row) => (
              <div key={row.id} className={styles.recentRow}>
                <span className={styles.patientCell}>{row.patientName}</span>
                <span className={styles.timeCell}>{formatDate(row.lastVisitIso)}</span>
                <span className={styles.notesCell}>{t(`recentPatients.${row.rowKey}.notes`)}</span>
              </div>
            ))}
          </section>
        </section>

        <aside className={styles.sideColumn}>
          <SlideCardsDashboard />
          <div className={styles.profileCard}>
            <div className={styles.profileTop}>
              <div className={styles.profileIdentity}>
                <div className={styles.profileAvatar}>DR</div>
                <div>
                  <div className={styles.profileName}>{t("eyebrow")}</div>
                  <div className={styles.profileSub}>{t("referralsTitle")}</div>
                </div>
              </div>
              <button type="button" className={styles.inlineMenuBtn} aria-label={t("recentViewAll")}>
                <FiMoreHorizontal size={16} />
              </button>
            </div>
            <h3 className={styles.midTitle}>{t("chartTitle")}</h3>
            <div className={styles.miniBars}>
              {chartData.map((item) => (
                <div key={item.day} className={styles.miniBarItem}>
                  <div className={styles.miniBar} style={{ height: `${Math.max(18, item.value * 3)}px` }} />
                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.glassCard}>
            <h3 className={styles.midTitle}>{t("stats.completedToday")}</h3>
            <div className={styles.metricList}>
              {stats.map((stat) => (
                <div key={stat.id} className={styles.metricRow}>
                  <span>{t(`stats.${stat.id}`)}</span>
                  <strong>{stat.value.toLocaleString(locale)}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UI;
