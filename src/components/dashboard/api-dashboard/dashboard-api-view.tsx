"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowRight,
  FiBarChart2,
  FiClipboard,
  FiExternalLink,
  FiFileText,
  FiInbox,
  FiMessageSquare,
  FiPieChart,
  FiRefreshCw,
} from "react-icons/fi";
import { BarChart } from "@mantine/charts";
import { useElementSize } from "@mantine/hooks";
import { useLocale, useTranslations } from "next-intl";
import type {
  ChartBreakdownItem,
  DashboardData,
} from "@/modules/dashboard";
import { SlideCardsSidebar } from "@/app/[locale]/(website)/ui/landing/slide-cards-section";
import {
  ADMIN_HERO_PILLS,
  HERO_HIGHLIGHT_KEYS,
  SUMMARY_META,
  type HeroPillConfig,
  type SummaryKey,
} from "./summary-config";
import { getStatusVariant } from "./status-utils";
import styles from "./styles.module.scss";

type PromoLocation = "admin_dashboard" | "doctor_dashboard" | "patient_dashboard";

type Props = {
  dashboard: DashboardData | null;
  summaryKeys: SummaryKey[];
  translationNamespace: "admin.dashboard" | "patient.dashboard" | "doctor.dashboard";
  layout?: "split" | "simple";
  /** @deprecated Promo slot replaced by square offers sidebar; kept for call-site compatibility */
  promoLocation?: PromoLocation;
};

const STATUS_CLASS: Record<string, string> = {
  pending: styles.statusPending,
  review: styles.statusReview,
  completed: styles.statusCompleted,
  resolved: styles.statusResolved,
  default: styles.statusDefault,
};

const BREAKDOWN_COLORS = ["#009cc2", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

const formatNumber = (value: number, locale: string) =>
  value.toLocaleString(locale, { maximumFractionDigits: 0 });

const formatDate = (iso: string, locale: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, { dateStyle: "medium" });
};

const SectionBand = ({
  title,
  subtitle,
  id,
}: {
  title: string;
  subtitle: string;
  id?: string;
}) => (
  <div className={styles.sectionBand} id={id}>
    <div>
      <h2 className={styles.sectionBandTitle}>{title}</h2>
      <p className={styles.sectionBandSub}>{subtitle}</p>
    </div>
    <div className={styles.sectionBandLine} aria-hidden="true" />
  </div>
);

const EmptyIllustration = ({
  icon: Icon,
  message,
}: {
  icon: typeof FiInbox;
  message: string;
}) => (
  <div className={styles.emptyIllustration}>
    <div className={styles.emptyIconWrap} aria-hidden="true">
      <Icon size={18} />
    </div>
    <p className={styles.emptyMessage}>{message}</p>
  </div>
);

type QuickAction = {
  href: string;
  label: string;
  icon: typeof FiClipboard;
};

const QuickActionBar = ({ actions }: { actions: QuickAction[] }) => {
  if (actions.length === 0) return null;

  return (
    <nav className={styles.quickActions} aria-label="Quick navigation">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.href} href={action.href} className={styles.quickActionChip}>
            <Icon size={14} aria-hidden="true" />
            <span>{action.label}</span>
            <FiArrowRight size={12} className={styles.quickActionArrow} aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const variant = getStatusVariant(status);
  return (
    <span className={`${styles.statusBadge} ${STATUS_CLASS[variant]}`}>{status}</span>
  );
};

const BreakdownList = ({
  items,
  emptyLabel,
}: {
  items: ChartBreakdownItem[];
  emptyLabel: string;
}) => {
  if (items.length === 0) {
    return <p className={styles.emptyInline}>{emptyLabel}</p>;
  }

  const maxCount = Math.max(...items.map((item) => item.count ?? item.value), 1);

  return (
    <div className={styles.breakdownList}>
      {items.map((item, index) => {
        const count = item.count ?? item.value;
        const pct = Math.round((count / maxCount) * 100);
        const color = BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length];
        return (
          <div key={`${item.label}-${index}`} className={styles.breakdownRow}>
            <span className={styles.breakdownLabel} title={item.label}>
              {item.label}
            </span>
            <div className={styles.breakdownTrack}>
              <div
                className={styles.breakdownFill}
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <span className={styles.breakdownCount}>{count}</span>
          </div>
        );
      })}
    </div>
  );
};

const StatCard = ({
  statKey,
  value,
  label,
  maxInRow,
  locale,
  className,
  animationDelayMs,
}: {
  statKey: SummaryKey;
  value: number;
  label: string;
  maxInRow: number;
  locale: string;
  className: string;
  animationDelayMs: number;
}) => {
  const meta = SUMMARY_META[statKey];
  const Icon = meta.icon;
  const barPct = maxInRow > 0 ? Math.min(100, Math.round((value / maxInRow) * 100)) : 0;

  return (
    <div
      className={`${styles.statCard} ${styles.statCardAnimated} ${className}`}
      style={
        {
          animationDelay: `${animationDelayMs}ms`,
          "--stat-accent": meta.accentColor,
        } as CSSProperties
      }
    >
      <div className={styles.statTop}>
        <div
          className={styles.statIconWrap}
          style={
            {
              background: meta.accentBg,
              color: meta.accentColor,
            } as CSSProperties
          }
        >
          <Icon size={16} />
        </div>
      </div>
      <div
        className={styles.statValue}
        style={{ color: meta.accentColor } as CSSProperties}
      >
        {formatNumber(value, locale)}
      </div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statBar}>
        <div
          className={styles.statBarFill}
          style={
            {
              width: `${Math.max(barPct, 8)}%`,
              background: meta.accentColor,
            } as CSSProperties
          }
        />
      </div>
    </div>
  );
};

const RecentTable = ({
  title,
  icon: Icon,
  count,
  head,
  rows,
  emptyLabel,
  viewAllHref,
  viewAllLabel,
}: {
  title: string;
  icon: typeof FiClipboard;
  count: number;
  head: [string, string, string];
  rows: ReactNode[];
  emptyLabel: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) => (
  <div className={styles.recentCard}>
    <div className={styles.recentCardHead}>
      <div className={styles.recentCardTitle}>
        <span className={styles.recentCardIcon} aria-hidden="true">
          <Icon size={14} />
        </span>
        <span>{title}</span>
      </div>
      <span className={styles.recentGroupCount}>{count}</span>
      {viewAllHref && viewAllLabel ? (
        <Link href={viewAllHref} className={styles.recentViewAll}>
          {viewAllLabel}
          <FiExternalLink size={11} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
    {rows.length === 0 ? (
      <EmptyIllustration icon={FiInbox} message={emptyLabel} />
    ) : (
      <div className={styles.recentTable}>
        <div className={styles.recentHead}>
          {head.map((col) => (
            <span key={col}>{col}</span>
          ))}
        </div>
        {rows}
      </div>
    )}
  </div>
);

/**
 * Renders API-driven dashboard sections: summary KPIs, charts, and recent activity.
 */
export const DashboardApiView = ({
  dashboard,
  summaryKeys,
  translationNamespace,
  layout = "split",
}: Props) => {
  const t = useTranslations(translationNamespace);
  const locale = useLocale();
  const { ref: chartRef, width: chartWidth } = useElementSize();

  const monthlyRequestsData = useMemo(
    () =>
      dashboard?.charts.monthlyRequests.map((row) => ({
        month: row.label,
        value: row.value,
      })) ?? [],
    [dashboard?.charts.monthlyRequests],
  );

  const monthlyRevenueData = useMemo(
    () =>
      dashboard?.charts.monthlyRevenue.map((row) => ({
        month: row.label,
        value: row.value,
      })) ?? [],
    [dashboard?.charts.monthlyRevenue],
  );

  const heroPills: HeroPillConfig[] = useMemo(() => {
    if (!dashboard) return [];
    if (translationNamespace === "admin.dashboard") {
      const adminPills = ADMIN_HERO_PILLS.filter((pill) =>
        summaryKeys.includes(pill.summaryKey),
      );
      if (adminPills.length > 0) return adminPills;
    }
    const heroKeys = HERO_HIGHLIGHT_KEYS.filter((k) => summaryKeys.includes(k));
    const keys = heroKeys.length > 0 ? heroKeys : summaryKeys.slice(0, 3);
    return keys.map((key) => ({ summaryKey: key, labelKey: `summary.${key}` }));
  }, [dashboard, summaryKeys, translationNamespace]);

  const roleSegment = translationNamespace.split(".")[0];
  const basePath = `/${locale}/${roleSegment}`;

  if (!dashboard) {
    return (
      <div className={styles.page}>
        <div className={styles.dashboardGrid}>
          <div className={styles.errorState} role="alert">
            <div className={styles.errorIcon}>
              <FiAlertCircle size={22} />
            </div>
            <p className={styles.errorTitle}>{t("loadError")}</p>
            <p className={styles.errorHint}>{t("errorRetry")}</p>
            <button
              type="button"
              className={styles.errorRetryBtn}
              onClick={() => window.location.reload()}
            >
              <FiRefreshCw size={14} aria-hidden="true" />
              {t("retryLoad")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { scope, summary, charts, recent } = dashboard;
  const isSplit = layout === "split";

  const maxStat = Math.max(...summaryKeys.map((k) => summary[k]), 1);
  const recordsHref = `${basePath}/test-requests`;
  const resultsHref = `${basePath}/test-results`;
  const complaintsHref = `${basePath}/complaints`;

  const heroCtaHref =
    roleSegment === "patient" ? resultsHref : recordsHref;

  const quickActions: QuickAction[] = [
    {
      href: recordsHref,
      label: t("quickActions.requests"),
      icon: FiClipboard,
    },
    {
      href: resultsHref,
      label: t("quickActions.results"),
      icon: FiFileText,
    },
    {
      href: complaintsHref,
      label: t("quickActions.complaints"),
      icon: FiMessageSquare,
    },
  ];

  const breakdownSections = [
    { key: "requestStatus", items: charts.requestStatus, title: t("sections.requestStatus") },
    { key: "resultStatus", items: charts.resultStatus, title: t("sections.resultStatus") },
    {
      key: "testCategoryBreakdown",
      items: charts.testCategoryBreakdown,
      title: t("sections.testCategoryBreakdown"),
    },
    {
      key: "userRoleDistribution",
      items: charts.userRoleDistribution,
      title: t("sections.userRoleDistribution"),
    },
  ].filter((s) => s.items.length > 0);

  const statSpan = summaryKeys.length <= 6 ? styles.span4 : styles.span3;
  const breakdownSpan =
    breakdownSections.length <= 2
      ? styles.span6
      : breakdownSections.length === 3
        ? styles.span4
        : styles.span3;

  const requestRows = recent.testRequests.map((row) => (
    <div key={row.id} className={styles.recentRow}>
      <span className={styles.cellPrimary} title={row.medicalTestName}>
        {row.medicalTestName}
      </span>
      <span className={styles.cellMuted}>
        {formatDate(row.requestDate, locale)} · {formatNumber(row.totalAmount, locale)}
      </span>
      <StatusBadge status={row.status} />
    </div>
  ));

  const resultRows = recent.testResults.map((row) => (
    <div key={row.id} className={styles.recentRow}>
      <span className={styles.cellPrimary}>{row.medicalTestName}</span>
      <span className={styles.cellMuted}>
        {formatDate(row.resultDate, locale)} · #{row.testRequestId}
      </span>
      <StatusBadge status={row.status} />
    </div>
  ));

  const complaintRows = recent.complaints.map((row) => (
    <div key={row.id} className={styles.recentRow}>
      <span className={styles.cellPrimary} title={row.title}>
        {row.title}
      </span>
      <StatusBadge status={row.status} />
      <span className={styles.cellMuted}>{formatDate(row.createdAt, locale)}</span>
    </div>
  ));

  return (
    <div className={styles.page}>
      <div className={styles.dashboardGrid}>
        {/* Row 1: Hero + aside */}
        <article className={`${styles.heroCard} ${isSplit ? styles.span8 : styles.span12}`}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>{t("eyebrow")}</p>
            <h1 className={styles.heroTitle}>
              {isSplit ? t("flowTitle") : t("apiTitle")}
            </h1>
            <p className={styles.heroSubtitle}>
              {isSplit ? t("chartSubtitle") : t("apiSubtitle")}
            </p>
            {isSplit ? (
              <Link href={recordsHref} className={styles.heroCta}>
                {t("recentViewAll")}
                <FiArrowRight size={14} aria-hidden="true" />
              </Link>
            ) : (
              <div className={styles.heroMeta}>
                <span className={styles.scopeBadge}>
                  {scope.role} ·{" "}
                  {scope.isGlobalDashboard ? t("scopeGlobal") : t("scopeScoped")}
                </span>
                <span className={styles.liveChip}>
                  <span className={styles.liveDot} />
                  {t("liveChip")}
                </span>
                <Link href={heroCtaHref} className={styles.heroCtaSecondary}>
                  {t("recentViewAll")}
                  <FiArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
          <div className={styles.heroStats}>
            {heroPills.map((pill) => (
              <div key={pill.summaryKey} className={styles.heroStatPill}>
                <span className={styles.heroStatValue}>
                  {formatNumber(summary[pill.summaryKey], locale)}
                </span>
                <span className={styles.heroStatLabel}>{t(pill.labelKey)}</span>
              </div>
            ))}
          </div>
        </article>

        {isSplit ? (
          <div className={`${styles.asideAdSlot} ${styles.span4}`}>
            <SlideCardsSidebar />
          </div>
        ) : null}

        <div className={styles.span12}>
          <QuickActionBar actions={quickActions} />
        </div>

        {/* Row 2: KPI stats */}
        <SectionBand
          id="dashboard-summary"
          title={t("quickSummary")}
          subtitle={t("quickSummarySub")}
        />
        {summaryKeys.map((key, index) => (
          <StatCard
            key={key}
            statKey={key}
            value={summary[key]}
            label={t(`summary.${key}`)}
            maxInRow={maxStat}
            locale={locale}
            className={statSpan}
            animationDelayMs={index * 45}
          />
        ))}

        {/* Row 3: Charts */}
        <SectionBand
          id="dashboard-analytics"
          title={t("sections.analytics")}
          subtitle={t("chartSubtitle")}
        />
        <div className={`${styles.glassCard} ${styles.span6}`}>
          <div className={styles.cardHead}>
            <div className={styles.cardHeadIcon}>
              <FiBarChart2 size={16} />
            </div>
            <div>
              <p className={styles.cardHeadTitle}>{t("sections.monthlyRequests")}</p>
              <p className={styles.cardHeadSub}>{t("chartSubtitle")}</p>
            </div>
          </div>
          <div className={styles.chartWrap} ref={chartRef}>
            {chartWidth > 0 && monthlyRequestsData.length > 0 ? (
              <BarChart
                h={200}
                data={monthlyRequestsData}
                dataKey="month"
                series={[{ name: "value", color: "var(--primary, #009cc2)" }]}
                barProps={{ radius: [6, 6, 0, 0] }}
                tickLine="none"
                gridAxis="y"
              />
            ) : (
              <div className={styles.chartPlaceholder}>
                <EmptyIllustration icon={FiBarChart2} message={t("emptyCharts")} />
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.glassCard} ${styles.span6}`}>
          <div className={styles.cardHead}>
            <div
              className={styles.cardHeadIcon}
              style={{ background: "rgba(16, 185, 129, 0.12)", color: "#059669" }}
            >
              <FiBarChart2 size={16} />
            </div>
            <div>
              <p className={styles.cardHeadTitle}>{t("sections.monthlyRevenue")}</p>
              <p className={styles.cardHeadSub}>{t("chartSubtitle")}</p>
            </div>
          </div>
          {monthlyRevenueData.length > 0 ? (
            <BarChart
              h={200}
              data={monthlyRevenueData}
              dataKey="month"
              series={[{ name: "value", color: "#10b981" }]}
              barProps={{ radius: [6, 6, 0, 0] }}
              tickLine="none"
              gridAxis="y"
            />
          ) : (
            <div className={styles.chartPlaceholder}>
              <EmptyIllustration icon={FiBarChart2} message={t("emptyCharts")} />
            </div>
          )}
        </div>

        {/* Row 4: Distribution */}
        {breakdownSections.length > 0 ? (
          <>
            <SectionBand
              title={t("sections.distribution")}
              subtitle={t("distributionSubtitle")}
            />
            {breakdownSections.map((section) => (
              <div key={section.key} className={`${styles.glassCard} ${breakdownSpan}`}>
                <div className={styles.cardHead}>
                  <div className={styles.cardHeadIcon}>
                    <FiPieChart size={16} />
                  </div>
                  <div>
                    <p className={styles.cardHeadTitle}>{section.title}</p>
                  </div>
                </div>
                <BreakdownList items={section.items} emptyLabel={t("emptyCharts")} />
              </div>
            ))}
          </>
        ) : null}

        {/* Row 5: Recent activity */}
        <div className={`${styles.recentPanel} ${styles.span12}`}>
          <div className={styles.recentPanelHead}>
            <SectionBand
              title={t("sections.recentActivity")}
              subtitle={t("recentSubtitle")}
            />
          </div>
          <div className={styles.recentGrid}>
            <RecentTable
              title={t("sections.recentRequests")}
              icon={FiClipboard}
              count={recent.testRequests.length}
              head={[t("recentCols.test"), t("recentCols.date"), t("recentCols.status")]}
              rows={requestRows}
              emptyLabel={t("recentEmpty")}
              viewAllHref={recordsHref}
              viewAllLabel={t("viewAllSection")}
            />
            <RecentTable
              title={t("sections.recentResults")}
              icon={FiFileText}
              count={recent.testResults.length}
              head={[t("recentCols.test"), t("recentCols.date"), t("recentCols.status")]}
              rows={resultRows}
              emptyLabel={t("recentEmpty")}
              viewAllHref={resultsHref}
              viewAllLabel={t("viewAllSection")}
            />
            <RecentTable
              title={t("sections.recentComplaints")}
              icon={FiMessageSquare}
              count={recent.complaints.length}
              head={[t("recentCols.title"), t("recentCols.status"), t("recentCols.date")]}
              rows={complaintRows}
              emptyLabel={t("recentEmpty")}
              viewAllHref={complaintsHref}
              viewAllLabel={t("viewAllSection")}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
