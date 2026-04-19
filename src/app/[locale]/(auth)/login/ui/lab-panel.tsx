import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import styles from "../scss/lab-panel.module.scss";

const LAB_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAgPaAIIx7njrMnEVYy8-R1T3bk9Nbf31gTF-hlWWidQj-mW2tcPGjE1vFpSw--fFVux3eEiOK0X8rUqTWSvpWPSMZ3Hhs1yehQeVNMg__0Uof0cXmc6i_3TEiJwTfbnQTp0W_MlH2XnLvPOMpqkdx7f8RwvJvBeXJ87ekjDyoWAnCOK9h-uJSXQ3AaqJSHgMSrn3etOpiSnCRTFjan4nRuE2G3j8al5rtK-s0z-NZyAZxur5AP7eq8TXHtIamTd1c4XyZ2KkrklOlS";

export function LabPanel() {
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
          <span className={styles.labBadgeText}>Center of Excellence</span>
        </div>
        <h1 className={styles.labTitle}>
          Precision in every{" "}
          <span className={styles.labTitleAccent}>molecular</span> detail.
        </h1>
        <p className={styles.labDescription}>
          Al Mutawali Lab combines editorial elegance with clinical rigor to
          deliver world-class diagnostic insights for patients and professionals.
        </p>
        <div className={styles.labStats}>
          <div className={styles.labStat}>
            <span className={styles.labStatValue}>99.9%</span>
            <span className={styles.labStatLabel}>Accuracy Rate</span>
          </div>
          <div className={styles.labDivider} />
          <div className={styles.labStat}>
            <span className={styles.labStatValue}>24h</span>
            <span className={styles.labStatLabel}>Result Turnaround</span>
          </div>
        </div>
      </div>
    </section>
  );
}
