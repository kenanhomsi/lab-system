"use client";

import { Fragment, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  FiActivity,
  FiArrowDown,
  FiArrowRight,
  FiArrowUp,
  FiCalendar,
  FiCheckCircle,
  FiDroplet,
  FiLoader,
  FiMoreHorizontal,
  FiMonitor,
  FiServer,
  FiUsers,
} from "react-icons/fi";
import { BarChart } from "@mantine/charts";
import { useElementSize } from "@mantine/hooks";
import { useLocale, useTranslations } from "next-intl";
import { PromoBanner } from "@/components/dashboard/promo-banner";
import { SlideCardsDashboard } from "../../../(website)/ui/landing/slide-cards-section";
import { useMirror } from "./store";
import type { QueueStage, QueueStageStatus, StatCard } from "./type";
import styles from "./styles.module.scss";

const STAT_ICONS = {
  activity: FiActivity,
  users: FiUsers,
  calendar: FiCalendar,
} as const;

const FLOW_ICONS = {
  monitor: FiMonitor,
  flask: FiDroplet,
  loader: FiLoader,
  check: FiCheckCircle,
} as const;

const STATUS_CLASS: Record<QueueStageStatus, string> = {
  positive: styles.statusPositive,
  waiting: styles.statusWaiting,
  active: styles.statusActive,
  verified: styles.statusVerified,
};

const RECENT_STATUS: Record<string, string> = {
  processing: styles.recentProcessing,
  critical: styles.recentCritical,
  completed: styles.recentCompleted,
};

const StatCardItem = ({ stat }: { stat: StatCard }) => {
  const t = useTranslations("admin.dashboard.stats");
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

const FlowCard = ({ stage }: { stage: QueueStage }) => {
  const t = useTranslations("admin.dashboard.queue");
  const locale = useLocale();
  const Icon = FLOW_ICONS[stage.iconKey];
  const label = t(`${stage.id}.label`);
  const subtitle = t(`${stage.id}.subtitle`);
  const badge = t(`${stage.id}.badge`);

  return (
    <div className={`${styles.flowCard} ${stage.accent ? styles.flowCardAccent : ""}`}>
      <div
        className={styles.flowIconWrap}
        style={{ background: stage.bgColor, color: stage.color } as CSSProperties}
      >
        <Icon size={18} />
      </div>
      <div className={styles.flowCardTitle}>{label}</div>
      <div className={styles.flowCardSub}>{subtitle}</div>
      <div className={styles.flowCardBottom}>
        <span className={styles.flowCount} style={{ color: stage.color } as CSSProperties}>
          {stage.count.toLocaleString(locale)}
        </span>
        <span className={`${styles.statusBadge} ${STATUS_CLASS[stage.statusVariant]}`}>
          {badge}
        </span>
      </div>
    </div>
  );
};

const UI = () => {
  const locale = useLocale();
  const t = useTranslations("admin.dashboard");
  const stats = useMirror("stats");
  const queue = useMirror("queue");
  const throughput = useMirror("throughput");
  const testDist = useMirror("testDist");
  const recentAnalysis = useMirror("recentAnalysis");
  const systemHealth = useMirror("systemHealth");

  const [chartRange, setChartRange] = useState<"Day" | "Month">("Month");
  const { ref: chartRef, width: chartWidth } = useElementSize();

  const chartData = useMemo(
    () =>
      throughput.map((row) => ({
        month: t(`chartMonths.${row.monthKey}`),
        value: row.value,
      })),
    [throughput, t],
  );

  const shortChartData = chartData.slice(-4);
  const profileInitials = "OA";

  return (
    <div className={styles.page}>
      <div className={styles.shellGrid}>
        <section className={styles.mainColumn}>
          <PromoBanner location="admin_dashboard" />
          <div className={styles.heroCard}>
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>{t("eyebrow")}</p>
              <h1 className={styles.heroTitle}>{t("flowTitle")}</h1>
              <p className={styles.heroSubtitle}>{t("chartSubtitle")}</p>
              <button className={styles.primaryCta} type="button">
                {t("recentViewAll")}
              </button>
            </div>
            <div className={styles.heroStats}>
              {stats.map((stat) => (
                <div key={stat.id} className={styles.heroStatPill}>
                  <span className={styles.heroStatLabel}>{t(`stats.${stat.id}`)}</span>
                  <span className={styles.heroStatValue}>{stat.value.toLocaleString(locale)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.statsRow}>
            {stats.map((stat) => (
              <StatCardItem key={stat.id} stat={stat} />
            ))}
          </div>

          <div className={styles.glassCard}>
            <div className={styles.flowHeader}>
              <h2 className={styles.flowTitle}>{t("flowTitle")}</h2>
              <span className={styles.liveChip}>
                <span className={styles.liveDot} />
                {t("liveMonitoringChip")}
              </span>
            </div>

            <div className={styles.flowRow}>
              {queue.map((stage, idx) => (
                <Fragment key={stage.id}>
                  <div className={styles.flowCardWrap}>
                    <FlowCard stage={stage} />
                  </div>
                  {idx < queue.length - 1 && (
                    <div className={styles.flowConnector} aria-hidden="true">
                      <div className={styles.dashedLine} />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <div className={styles.glassCard}>
            <div className={styles.midHeader}>
              <div>
                <h3 className={styles.midTitle}>{t("chartTitle")}</h3>
                <p className={styles.midSub}>{t("chartSubtitle")}</p>
              </div>
              <div className={styles.toggleGroup}>
                {(["Day", "Month"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`${styles.toggleBtn} ${chartRange === opt ? styles.toggleActive : ""}`}
                    onClick={() => setChartRange(opt)}
                  >
                    {opt === "Day" ? t("chartToggleDay") : t("chartToggleMonth")}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.chartWrap} ref={chartRef}>
              {chartWidth > 0 ? (
                <BarChart
                  h={240}
                  data={chartData}
                  dataKey="month"
                  series={[{ name: "value", color: "var(--primary)" }]}
                  barProps={{ radius: [7, 7, 0, 0] }}
                  tickLine="none"
                  gridAxis="none"
                />
              ) : (
                <div className={styles.chartPlaceholder} />
              )}
            </div>
          </div>

          <section className={styles.recentSection}>
            <div className={styles.recentHeader}>
              <h2 className={styles.recentTitle}>{t("recentTitle")}</h2>
              <button type="button" className={styles.viewAll}>
                {t("recentViewAll")} <FiArrowRight size={14} />
              </button>
            </div>

            <div className={styles.recentTable}>
              <div className={styles.recentHead}>
                <span>{t("recentCols.patient")}</span>
                <span>{t("recentCols.test")}</span>
                <span>{t("recentCols.time")}</span>
                <span>{t("recentCols.status")}</span>
                <span>{t("recentCols.action")}</span>
              </div>

              {recentAnalysis.map((row) => (
                <div key={row.id} className={styles.recentRow}>
                  <div className={styles.recentPatient}>
                    <div className={styles.recentAvatar}>
                      {row.patientId.replace(/^LAB-/, "").slice(-2)}
                    </div>
                    <div>
                      <div className={styles.recentPid}>{row.patientId}</div>
                      <div className={styles.recentPsub}>
                        {t(`recent.${row.rowKey}.patientSub`)}
                      </div>
                    </div>
                  </div>
                  <span className={styles.recentCell}>{t(`recent.${row.rowKey}.testType`)}</span>
                  <div>
                    <div className={styles.recentCell}>{t(`recent.${row.rowKey}.timestamp`)}</div>
                    <div className={styles.recentPsub}>{t(`recent.${row.rowKey}.timeSub`)}</div>
                  </div>
                  <span className={`${styles.statusBadge} ${RECENT_STATUS[row.statusVariant]}`}>
                    {t(`recent.${row.rowKey}.status`)}
                  </span>
                  <button type="button" className={styles.rowAction} aria-label={t("rowMenu")}>
                    •••
                  </button>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className={styles.sideColumn}>
          <SlideCardsDashboard />
          <div className={styles.profileCard}>
            <div className={styles.profileTop}>
              <div className={styles.profileIdentity}>
                <div className={styles.profileAvatar}>{profileInitials}</div>
                <div>
                  <div className={styles.profileName}>Online Admin</div>
                  <div className={styles.profileSub}>{t("eyebrow")}</div>
                </div>
              </div>
              <button type="button" className={styles.inlineMenuBtn} aria-label={t("rowMenu")}>
                <FiMoreHorizontal size={16} />
              </button>
            </div>

            <h3 className={styles.sideTitle}>{t("healthTitle")}</h3>
            <p className={styles.sideSub}>{t("healthFooter")}</p>

            <div className={styles.miniBars}>
              {shortChartData.map((item) => (
                <div key={item.month} className={styles.miniBarItem}>
                  <div
                    className={styles.miniBar}
                    style={{ height: `${Math.max(18, item.value / 22)}px` }}
                  />
                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.glassCard}>
            <h3 className={styles.midTitle}>{t("testDistTitle")}</h3>
            <div className={styles.distList}>
              {testDist.map((item) => (
                <div key={item.id} className={styles.distRow}>
                  <span className={styles.distName}>{t(`testDist.${item.id}`)}</span>
                  <div className={styles.distBarTrack}>
                    <div
                      className={styles.distBarFill}
                      style={{ width: `${item.pct}%`, background: item.color } as CSSProperties}
                    />
                  </div>
                  <span className={styles.distPct}>{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.bottomPair}>
            <div className={styles.healthCard}>
              <div className={styles.healthTop}>
                <span className={styles.healthLabel}>{t("healthTitle")}</span>
                <FiServer size={18} />
              </div>
              <div className={styles.healthGrid}>
                <div>
                  <span className={styles.healthCaption}>{t("healthLatency").toUpperCase()}</span>
                  <span className={styles.healthBig}>{systemHealth.latency}</span>
                </div>
                <div>
                  <span className={styles.healthCaption}>{t("healthUptime").toUpperCase()}</span>
                  <span className={styles.healthBig}>{systemHealth.uptime}</span>
                </div>
              </div>
              <div className={styles.healthSub}>
                {t("healthFooter")}
                <span className={styles.healthDot} />
              </div>
            </div>

            <div className={styles.qaCard}>
              <h4 className={styles.qaTitle}>{t("qaTitle")}</h4>
              <p className={styles.qaDesc}>{t("qaDesc")}</p>
              <div className={styles.qaFooter}>
                <div className={styles.qaAvatars}>
                  <div className={styles.qaAvatar}>{t("qaChipQc")}</div>
                  <div className={styles.qaAvatar}>{t("qaChipPath")}</div>
                  <div className={styles.qaAvatarCount}>{t("qaChipMore")}</div>
                </div>
                <div className={styles.qaValidated}>
                  <span className={styles.qaValidatedText}>
                    {t("qaFooterPrimary")}
                    <br />
                    {t("qaFooterSecondary")}
                  </span>
                </div>
                <FiCheckCircle className={styles.qaBadge} size={36} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UI;
