import { PromoBanner } from "@/components/dashboard/promo-banner";
import styles from "./styles.module.scss";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type MetricId = "pendingRequests" | "processingToday" | "readyForRelease" | "qualityAlerts";
type RequestStatusId = "processing" | "pendingQc" | "ready";
type SectionId = "latestRequests" | "workload" | "turnaround" | "testMix" | "quality";
type LabelId = "patient" | "test" | "status" | "receivedAt" | "team" | "queue" | "eta";

type LabDashboardCopy = {
  title: string;
  subtitle: string;
  eyebrow: string;
  cards: Record<MetricId, string>;
  sections: Record<SectionId, string>;
  labels: Record<LabelId, string>;
  statuses: Record<RequestStatusId, string>;
  insights: {
    turnaroundHint: string;
    qualityHint: string;
  };
};

const COPY: Record<"en" | "ar", LabDashboardCopy> = {
  en: {
    title: "Lab Dashboard",
    subtitle: "Operational snapshot and quality insights for today's pipeline.",
    eyebrow: "Live Operations",
    cards: {
      pendingRequests: "Pending requests",
      processingToday: "Processing today",
      readyForRelease: "Ready for release",
      qualityAlerts: "Quality alerts",
    },
    sections: {
      latestRequests: "Latest Requests",
      workload: "Team Workload",
      turnaround: "Turnaround Overview",
      testMix: "Test Mix",
      quality: "Quality Control",
    },
    labels: {
      patient: "Patient",
      test: "Test",
      status: "Status",
      receivedAt: "Received at",
      team: "Team",
      queue: "Queue",
      eta: "ETA",
    },
    statuses: {
      processing: "Processing",
      pendingQc: "Pending QC",
      ready: "Ready",
    },
    insights: {
      turnaroundHint: "Average turnaround improved versus yesterday.",
      qualityHint: "No critical blockers in validation workflow.",
    },
  },
  ar: {
    title: "لوحة المختبر",
    subtitle: "نظرة تشغيلية ومؤشرات جودة لمسار العمل اليومي.",
    eyebrow: "تشغيل مباشر",
    cards: {
      pendingRequests: "طلبات قيد الانتظار",
      processingToday: "قيد المعالجة اليوم",
      readyForRelease: "جاهزة للإصدار",
      qualityAlerts: "تنبيهات الجودة",
    },
    sections: {
      latestRequests: "أحدث الطلبات",
      workload: "عبء العمل على الفريق",
      turnaround: "نظرة على زمن الإنجاز",
      testMix: "توزيع التحاليل",
      quality: "ضبط الجودة",
    },
    labels: {
      patient: "المريض",
      test: "التحليل",
      status: "الحالة",
      receivedAt: "وقت الاستلام",
      team: "الفريق",
      queue: "الطابور",
      eta: "الوقت المتوقع",
    },
    statuses: {
      processing: "قيد المعالجة",
      pendingQc: "بانتظار مراجعة الجودة",
      ready: "جاهز",
    },
    insights: {
      turnaroundHint: "متوسط زمن الإنجاز تحسن مقارنة بالأمس.",
      qualityHint: "لا توجد عوائق حرجة في دورة التحقق.",
    },
  },
};

const summaryCards: Array<{ value: number; key: MetricId; trend: number; progress: number }> = [
  { value: 28, key: "pendingRequests", trend: -4.2, progress: 52 },
  { value: 64, key: "processingToday", trend: 8.6, progress: 74 },
  { value: 15, key: "readyForRelease", trend: 5.1, progress: 66 },
  { value: 3, key: "qualityAlerts", trend: -1.4, progress: 22 },
];

const latestRequests: Array<{
  id: string;
  patient: string;
  test: string;
  status: RequestStatusId;
  receivedAt: string;
}> = [
  { id: "REQ-1043", patient: "L-2219", test: "CBC", status: "processing", receivedAt: "09:40" },
  { id: "REQ-1044", patient: "L-1871", test: "Thyroid Panel", status: "pendingQc", receivedAt: "10:05" },
  { id: "REQ-1045", patient: "L-3037", test: "Liver Function", status: "ready", receivedAt: "10:12" },
  { id: "REQ-1046", patient: "L-1992", test: "HbA1c", status: "processing", receivedAt: "10:28" },
];

const teamWorkload = [
  { team: "Hematology", queue: 12, eta: "25m", load: 76 },
  { team: "Biochemistry", queue: 9, eta: "20m", load: 61 },
  { team: "Microbiology", queue: 7, eta: "30m", load: 54 },
  { team: "Molecular", queue: 4, eta: "18m", load: 40 },
] as const;

const turnaroundData = [
  { label: "08:00", value: 26 },
  { label: "10:00", value: 44 },
  { label: "12:00", value: 62 },
  { label: "14:00", value: 55 },
] as const;

const testMixData = [
  { label: "CBC", value: 36 },
  { label: "Chemistry", value: 27 },
  { label: "Hormones", value: 22 },
  { label: "Culture", value: 15 },
] as const;

/**
 * Lab dashboard page with admin-like visual hierarchy and responsive UX.
 */
export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const copy = COPY[isArabic ? "ar" : "en"];

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={styles.page}>
      <div className={styles.shellGrid}>
        <section className={styles.mainColumn}>
          <PromoBanner location="lab_dashboard" />

          <article className={styles.heroCard}>
            <div>
              <p className={styles.heroEyebrow}>{copy.eyebrow}</p>
              <h1 className={styles.heroTitle}>{copy.title}</h1>
              <p className={styles.heroSubtitle}>{copy.subtitle}</p>
            </div>
            <div className={styles.heroStats}>
              {summaryCards.slice(0, 3).map((card) => (
                <div key={card.key} className={styles.heroStatPill}>
                  <span>{copy.cards[card.key]}</span>
                  <strong>{card.value.toLocaleString(locale)}</strong>
                </div>
              ))}
            </div>
          </article>

          <section className={styles.statsGrid}>
            {summaryCards.map((card) => {
              const isPositive = card.trend >= 0;
              return (
                <article key={card.key} className={styles.statCard}>
                  <div className={styles.statTop}>
                    <p className={styles.statLabel}>{copy.cards[card.key]}</p>
                    <span className={`${styles.trendChip} ${isPositive ? styles.trendUp : styles.trendDown}`}>
                      {isPositive ? "+" : "-"}
                      {Math.abs(card.trend).toFixed(1)}%
                    </span>
                  </div>
                  <p className={styles.statValue}>{card.value.toLocaleString(locale)}</p>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${card.progress}%` }} />
                  </div>
                </article>
              );
            })}
          </section>

          <section className={styles.glassCard}>
            <div className={styles.sectionHeader}>
              <h2>{copy.sections.latestRequests}</h2>
              <span className={styles.liveBadge}>{copy.eyebrow}</span>
            </div>

            <div className={styles.tableWrap}>
              <div className={styles.tableHead}>
                <span>#</span>
                <span>{copy.labels.patient}</span>
                <span>{copy.labels.test}</span>
                <span>{copy.labels.status}</span>
                <span>{copy.labels.receivedAt}</span>
              </div>

              {latestRequests.map((row) => (
                <div key={row.id} className={styles.tableRow}>
                  <strong>{row.id}</strong>
                  <span>{row.patient}</span>
                  <span>{row.test}</span>
                  <span
                    className={`${styles.statusChip} ${
                      row.status === "ready"
                        ? styles.statusReady
                        : row.status === "pendingQc"
                          ? styles.statusPending
                          : styles.statusProcessing
                    }`}
                  >
                    {copy.statuses[row.status]}
                  </span>
                  <span>{row.receivedAt}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.glassCard}>
            <div className={styles.sectionHeader}>
              <h2>{copy.sections.workload}</h2>
            </div>

            <div className={styles.workloadList}>
              {teamWorkload.map((row) => (
                <article key={row.team} className={styles.workloadRow}>
                  <div>
                    <strong>{row.team}</strong>
                    <p>
                      {copy.labels.queue}: {row.queue}
                    </p>
                  </div>
                  <div className={styles.workloadMeta}>
                    <span>
                      {copy.labels.eta}: {row.eta}
                    </span>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${row.load}%` }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className={styles.sideColumn}>
          <section className={styles.glassCard}>
            <h3>{copy.sections.turnaround}</h3>
            <p className={styles.sideHint}>{copy.insights.turnaroundHint}</p>
            <div className={styles.miniChart}>
              {turnaroundData.map((point) => (
                <div key={point.label} className={styles.chartCol}>
                  <div className={styles.chartBar} style={{ height: `${point.value}%` }} />
                  <span>{point.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.glassCard}>
            <h3>{copy.sections.testMix}</h3>
            <div className={styles.mixList}>
              {testMixData.map((item) => (
                <div key={item.label} className={styles.mixRow}>
                  <span>{item.label}</span>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${item.value}%` }} />
                  </div>
                  <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`${styles.glassCard} ${styles.qualityCard}`}>
            <h3>{copy.sections.quality}</h3>
            <p>{copy.insights.qualityHint}</p>
            <div className={styles.qualityFooter}>
              <strong>97%</strong>
              <span>{copy.cards.qualityAlerts}</span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
