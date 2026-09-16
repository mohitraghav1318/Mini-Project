import Link from "next/link";
import styles from "./HomeFooter.module.scss";

/**
 * Layer 2 — Section Component
 * CTA band + 3-column footer.
 */
export default function HomeFooter({ cta, footer }) {
  return (
    <>
      {/* CTA Band */}
      {cta && (
        <section className={styles.ctaBand}>
          <h2 className={styles.ctaHeading}>{cta.heading}</h2>
          <Link href="/register" className={styles.ctaBtn}>
            {cta.button}
          </Link>
        </section>
      )}

      {/* Footer */}
      {footer && (
        <footer className={styles.footer}>
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.col}>
              <span className={styles.logo}>🌸 {footer.logo}</span>
              <p className={styles.tagline}>{footer.tagline}</p>
            </div>

            {/* Quick links */}
            <div className={styles.col}>
              <h4 className={styles.colHeading}>Quick Links</h4>
              {footer.links?.map((l, i) => (
                <Link key={i} href={l.href} className={styles.link}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Support */}
            <div className={styles.col}>
              <h4 className={styles.colHeading}>Help & Support</h4>
              {footer.support?.map((l, i) => (
                <Link key={i} href={l.href} className={styles.link}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} {footer.logo}. All rights reserved.
          </p>
        </footer>
      )}
    </>
  );
}
