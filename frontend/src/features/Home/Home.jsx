"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Home.module.scss";
import { homeData } from "./data/home.data";

// ── Hero Carousel ──────────────────────────────────────────────────────────
function HeroCarousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (index) => {
    clearInterval(timerRef.current);
    setCurrent((index + slides.length) % slides.length);
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const slide = slides[current];
  const textClass = slide.textLight ? styles.lightText : styles.darkText;

  return (
    <section className={styles.hero} style={{ background: slide.bg }}>
      <div className={`${styles.heroInner} ${textClass}`}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>{slide.eyebrow}</span>
          <h1>
            {slide.heading}{" "}
            <span className={slide.textLight ? styles.accentLight : styles.accentDark}>
              {slide.accent}
            </span>
          </h1>
          <p>{slide.subheading}</p>
          <Link href="/register" className={`${styles.heroCta} ${slide.textLight ? styles.heroCtaLight : styles.heroCtaDark}`}>
            {slide.cta} →
          </Link>
        </div>
        <div className={styles.heroGraphic} style={{ background: slide.graphicBg }} aria-hidden="true">
          <span className={styles.heroEmoji}>{slide.emoji}</span>
        </div>
      </div>

      {/* Arrows */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => goTo(current - 1)} aria-label="Previous slide">‹</button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => goTo(current + 1)} aria-label="Next slide">›</button>

      {/* Dots */}
      <div className={styles.dots} role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Feature chips */}
      <div className={styles.chips} aria-hidden="true">
        {homeData.chips.map((chip) => (
          <span key={chip.label} className={styles.chip}>
            <span>{chip.icon}</span>
            {chip.label}
          </span>
        ))}
      </div>
    </section>
  );
}

// ── Stats Bar ──────────────────────────────────────────────────────────────
function StatsBar({ stats }) {
  return (
    <section className={styles.statsBar} aria-label="Platform statistics">
      {stats.map((stat, i) => (
        <div key={i} className={styles.statItem}>
          <span className={styles.statIcon}>{stat.icon}</span>
          <strong className={styles.statNumber} style={{ color: stat.color }}>{stat.number}</strong>
          <span className={styles.statLabel}>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}

// ── Community Card ─────────────────────────────────────────────────────────
function CommunityCard({ thumbnail, category, title, href }) {
  return (
    <div className={styles.communityCard}>
      <div className={styles.cardThumbnail} style={{ background: thumbnail }}>
        <span className={styles.categoryTag}>{category}</span>
      </div>
      <div className={styles.cardBody}>
        <Link href={href || "/community"} className={styles.cardTitle}>{title}</Link>
      </div>
    </div>
  );
}

// ── Communities Row ────────────────────────────────────────────────────────
function CommunitiesRow({ headingMain, headingAccent, communities, viewAllHref }) {
  return (
    <section className={styles.communitiesSection}>
      <div className={styles.sectionHeader}>
        <h2>
          {headingMain} <span className={styles.saffronText}>{headingAccent}</span>
        </h2>
        <Link href={viewAllHref || "/community"} className={styles.viewAllBtn}>View All &gt;</Link>
      </div>
      <div className={styles.cardsWrapper}>
        <div className={styles.cardsRow}>
          {communities.map((c, i) => (
            <CommunityCard key={i} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How To Join ────────────────────────────────────────────────────────────
function HowToJoin({ steps }) {
  return (
    <section className={styles.howToSection}>
      <h2 className={styles.howToHeading}>
        समूह से कैसे <span className={styles.saffronText}>जुड़ें?</span>
      </h2>
      <div className={styles.stepsGrid}>
        {steps.map((step, i) => (
          <div key={i} className={styles.stepCard}>
            <div className={styles.stepBadge}>{i + 1}</div>
            <div className={styles.stepIconWrap} aria-hidden="true">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <div className={styles.stepBar} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Cluster Grid ───────────────────────────────────────────────────────────
function ClusterGrid({ clusters }) {
  return (
    <section className={styles.clusterSection}>
      <h2>अपना <span className={styles.saffronText}>समूह</span> चुनें</h2>
      <div className={styles.clusterGrid}>
        {clusters.map((cluster, i) => (
          <div key={i} className={styles.clusterCard}>
            <span className={styles.clusterEmoji} aria-hidden="true">{cluster.emoji}</span>
            <h3>{cluster.name}</h3>
            <span className={styles.memberCount}>👥 {cluster.members} सदस्य</span>
            <Link href="/register" className={styles.joinBtn}>जुड़ें</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Testimonial ────────────────────────────────────────────────────────────
function Testimonial({ quote, author, location }) {
  return (
    <section className={styles.testimonial} aria-label="Success story">
      <div className={styles.testimonialInner}>
        <span className={styles.quoteIcon} aria-hidden="true">"</span>
        <p>{quote}</p>
        <cite>— {author}, {location}</cite>
      </div>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────
function FAQ({ questions }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={styles.faqSection}>
      <h2>
        अक्सर पूछे जाने वाले <span className={styles.saffronText}>सवाल</span>
      </h2>
      <div className={styles.faqList}>
        {questions.map((q, i) => (
          <div key={i} className={`${styles.faqItem} ${openIndex === i ? styles.faqItemOpen : ""}`}>
            <button
              className={styles.faqQuestion}
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
            >
              <span>{q.question}</span>
              <span className={styles.faqToggle} aria-hidden="true">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div className={styles.faqAnswer}>
                <p>{q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <Link href="/register" className={styles.faqAllBtn}>Explore All FAQs</Link>
    </section>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────
export default function Home() {
  const {
    hero, stats,
    popularCommunities, newCommunities,
    steps, clusters, testimonial, faq, cta, footer,
  } = homeData;

  return (
    <main className={styles.home}>
      <HeroCarousel slides={hero.slides} />
      <StatsBar stats={stats} />
      <CommunitiesRow
        headingMain="लोकप्रिय"
        headingAccent="Communities"
        communities={popularCommunities}
        viewAllHref="/community"
      />
      <CommunitiesRow
        headingMain="नई"
        headingAccent="Communities"
        communities={newCommunities}
        viewAllHref="/community"
      />
      <HowToJoin steps={steps} />
      <ClusterGrid clusters={clusters} />
      <Testimonial {...testimonial} />
      <FAQ questions={faq} />

      {/* CTA Band */}
      <section className={styles.ctaBand}>
        <h2>{cta.heading}</h2>
        <Link href="/register" className={styles.ctaBtn}>{cta.button}</Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <span className={styles.footerLogo}>{footer.logo}</span>
            <p>{footer.tagline}</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Quick Links</h4>
            {footer.links.map((l, i) => (
              <Link key={i} href={l.href} className={styles.footerLink}>{l.label}</Link>
            ))}
          </div>
          <div className={styles.footerCol}>
            <h4>Help &amp; Support</h4>
            {footer.support.map((l, i) => (
              <Link key={i} href={l.href} className={styles.footerLink}>{l.label}</Link>
            ))}
          </div>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} {footer.logo}. All rights reserved.</p>
      </footer>
    </main>
  );
}
