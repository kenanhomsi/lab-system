"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import {
  FiActivity,
  FiArrowDown,
  FiArrowRight,
  FiArrowUp,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import { BarChart } from "@mantine/charts";
import { useLocale, useTranslations } from "next-intl";
import { useMirror } from "./store";
import type { StatCard } from "./type";
import { DashboardAdCard } from "@/components/dashboard/ad-space";
import styles from "./styles.module.scss";

const STAT_ICONS = {
  users: FiUsers,
  calendar: FiCalendar,
  activity: FiActivity,
} as const;

const SCHEDULE_STATUS_CLASS: Record<
  "confirmed" | "inProgress" | "waiting",
  string
> = {
  confirmed: styles.statusConfirmed,
  inProgress: styles.statusInProgress,
  waiting: styles.statusWaiting,
};

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
  const todayAppointments = useMirror("todayAppointments");
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

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (iso: string) => {
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

      <DashboardAdCard />

      <section className={styles.glassCard} style={{ marginBottom: 24 }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t("scheduleTitle")}</h2>
          <button type="button" className={styles.viewAll}>
            {t("scheduleViewAll")} <FiArrowRight size={14} />
          </button>
        </div>
        <div className={styles.scheduleHead}>
          <span>{t("scheduleCols.patient")}</span>
          <span>{t("scheduleCols.time")}</span>
          <span>{t("scheduleCols.type")}</span>
          <span>{t("scheduleCols.status")}</span>
        </div>
        {todayAppointments.map((row) => (
          <div key={row.id} className={styles.scheduleRow}>
            <span className={styles.patientCell}>{row.patientName}</span>
            <span className={styles.timeCell}>{formatTime(row.timeIso)}</span>
            <span className={styles.typeCell}>
              {t(`visitTypes.${row.visitType}`)}
            </span>
            <span
              className={`${styles.statusBadge} ${SCHEDULE_STATUS_CLASS[row.statusVariant]}`}
            >
              {t(`scheduleStatus.${row.statusVariant}`)}
            </span>
          </div>
        ))}
      </section>

      <div className={styles.midGrid}>
        <div className={styles.glassCard}>
          <h3 className={styles.midTitle}>{t("referralsTitle")}</h3>
          <p className={styles.midSub}>{t("referralsSubtitle")}</p>
          <div className={styles.referralList}>
            {pendingReferrals.map((ref) => (
              <div key={ref.id} className={styles.referralRow}>
                <div className={styles.referralMain}>
                  <div className={styles.referralPatient}>{ref.patientName}</div>
                  <div className={styles.referralTests}>{ref.testSummary}</div>
                  <div className={styles.referralTests}>
                    {t(`referrals.${ref.rowKey}.note`)}
                  </div>
                </div>
                <span
                  className={`${styles.statusBadge} ${REFERRAL_STATUS_CLASS[ref.statusVariant]}`}
                >
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
    </div>
  );
};

export default UI;
