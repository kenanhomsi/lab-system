"use client";

import type { Ref } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { BarChart } from "@mantine/charts";
import styles from "./styles.module.scss";

type ChartRow = {
  month: string;
  value: number;
};

type Props = {
  chartRef: Ref<HTMLDivElement>;
  chartWidth: number;
  monthlyRequestsData: ChartRow[];
  monthlyRevenueData: ChartRow[];
  monthlyRequestsTitle: string;
  monthlyRevenueTitle: string;
  chartSubtitle: string;
  emptyChartsLabel: string;
};

const ChartEmpty = ({ message }: { message: string }) => (
  <div className={styles.emptyIllustration}>
    <div className={styles.emptyIconWrap} aria-hidden="true">
      <FiBarChart2 size={18} />
    </div>
    <p className={styles.emptyMessage}>{message}</p>
  </div>
);

/**
 * Lazy-loaded Mantine bar charts for dashboard monthly metrics.
 */
export function DashboardCharts({
  chartRef,
  chartWidth,
  monthlyRequestsData,
  monthlyRevenueData,
  monthlyRequestsTitle,
  monthlyRevenueTitle,
  chartSubtitle,
  emptyChartsLabel,
}: Props) {
  return (
    <>
      <div className={`${styles.glassCard} ${styles.span6}`}>
        <div className={styles.cardHead}>
          <div className={styles.cardHeadIcon}>
            <FiBarChart2 size={16} />
          </div>
          <div>
            <p className={styles.cardHeadTitle}>{monthlyRequestsTitle}</p>
            <p className={styles.cardHeadSub}>{chartSubtitle}</p>
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
              <ChartEmpty message={emptyChartsLabel} />
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
            <p className={styles.cardHeadTitle}>{monthlyRevenueTitle}</p>
            <p className={styles.cardHeadSub}>{chartSubtitle}</p>
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
            <ChartEmpty message={emptyChartsLabel} />
          </div>
        )}
      </div>
    </>
  );
}
