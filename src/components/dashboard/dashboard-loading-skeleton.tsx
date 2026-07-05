import styles from "./dashboard-loading.module.scss";

/**
 * Skeleton placeholder shown while dashboard route segments load.
 */
export function DashboardLoadingSkeleton() {
  return (
    <div className={styles.root} aria-busy="true" aria-label="Loading dashboard">
      <div className={styles.hero} />
      <div className={styles.statsRow}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.statCard} />
        ))}
      </div>
      <div className={styles.chartsRow}>
        <div className={styles.chartCard} />
        <div className={styles.chartCard} />
      </div>
      <div className={styles.tableCard} />
    </div>
  );
}
