import Link from "next/link";
import styles from "../scss/footer-links.module.scss";

export function LoginFooterLinks() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.footerCopyright}>
          © {new Date().getFullYear()} Al Mutawali Lab. Precision in Diagnostics.
        </p>
        <div className={styles.footerLinks}>
          <Link href="#" className={styles.footerLink}>
            Privacy Policy
          </Link>
          <Link href="#" className={styles.footerLink}>
            Patient Rights
          </Link>
        </div>
      </div>
    </footer>
  );
}
