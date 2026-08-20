"use client";

import Link from "next/link";
import styles from "./Home.module.scss";
import { homeData } from "./data/home.data";
import { useScrollReveal } from "./hooks/useScrollReveal";
import BorderMotif from "@/components/BorderMotif/BorderMotif";

const ICONS = {
  learn: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5c2-1 5-1 8 0v14c-3-1-6-1-8 0V5Z" />
      <path d="M20 5c-2-1-5-1-8 0v14c3-1 6-1 8 0V5Z" />
    </svg>
  ),
  connect: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M3 20c0-3 2.5-5 5-5s5 2 5 5" />
      <path d="M11 20c0-3 2.5-5 5-5s5 2 5 5" />
    </svg>
  ),
  help: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20s-6-4-8.5-8C1.8 9 2.5 6 5 5.5c1.7-.3 3 .6 4 2 1-1.4 2.3-2.3 4-2 2.5.5 3.2 3.5 1.5 6.5C12 16 12 20 12 20Z" />
    </svg>
  ),
};

function PillarCard({ icon, title, description }) {
  const [ref, isVisible] = useScrollReveal();
  const Icon = ICONS[icon];

  return (
    <div ref={ref} className={`${styles.pillarCard} ${isVisible ? styles.isVisible : ""}`}>
      <span className={styles.pillarIcon}>
        <Icon width={28} height={28} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const { nav, hero, pillars, points, cta, footer } = homeData;
  const [pointsRef, pointsVisible] = useScrollReveal();

  return (
    <main className={styles.home}>
      <header className={styles.nav}>
        <span className={styles.logo}>{nav.logo}</span>
        <nav className={styles.navLinks}>
          {nav.links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href={nav.cta.href} className={styles.navCta}>
            {nav.cta.label}
          </Link>
        </nav>
      </header>

      <BorderMotif />

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>{hero.eyebrow}</span>
          <h1>{hero.heading}</h1>
          <p>{hero.subheading}</p>
          <div className={styles.heroActions}>
            <Link href={hero.primaryCta.href} className={styles.primaryButton}>
              {hero.primaryCta.label}
            </Link>
            <a href={hero.secondaryCta.href} className={styles.secondaryButton}>
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
        <div className={styles.heroGraphic} aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="var(--color-marigold)" strokeWidth="2" />
            <circle cx="100" cy="100" r="55" stroke="var(--color-alta)" strokeWidth="2" />
            <circle cx="100" cy="100" r="30" fill="var(--color-indigo)" />
          </svg>
        </div>
      </section>

      <section id="how-it-works" className={styles.pillars}>
        {pillars.map((pillar) => (
          <PillarCard key={pillar.icon} {...pillar} />
        ))}
      </section>

      <section
        ref={pointsRef}
        className={`${styles.pointsBanner} ${pointsVisible ? styles.isVisible : ""}`}
      >
        <h2>{points.heading}</h2>
        <p>{points.description}</p>
      </section>

      <BorderMotif flip />

      <section className={styles.ctaBand}>
        <h2>{cta.heading}</h2>
        <Link href={cta.button.href} className={styles.primaryButton}>
          {cta.button.label}
        </Link>
      </section>

      <footer className={styles.footer}>
        <span className={styles.logo}>{nav.logo}</span>
        <p>{footer.tagline}</p>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {nav.logo}
        </p>
      </footer>
    </main>
  );
}