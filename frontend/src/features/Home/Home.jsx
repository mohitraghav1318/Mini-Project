"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Home.module.scss";
import { getHomeData } from "./data/home.data";
import { useLocale } from 'next-intl';

// ── Hero Carousel ──────────────────────────────────────────────────────────
function HeroCarousel({ slides, chips }) {
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

  if (!slides || slides.length === 0) return null;
  const slide = slides[current];
  const textClass = slide.textLight ? styles.lightText : styles.darkText;

  return (
    <section className={styles.hero} style={{ background: slide.bg }}>
      <div className={"" + styles.heroInner + " " + textClass}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>{slide.eyebrow}</span>
          <h1>
            {slide.heading}{" "}
            <span className={slide.textLight ? styles.accentLight : styles.accentDark}>
              {slide.accent}
            </span>
          </h1>
          <p>{slide.subheading}</p>
          <Link href="/register" className={"" + styles.heroCta + " " + (slide.textLight ? styles.heroCtaLight : styles.heroCtaDark)}>
            {slide.cta} →
          </Link>
        </div>
        <div className={styles.heroGraphic} style={{ background: slide.graphicBg }} aria-hidden="true">
          <span className={styles.heroEmoji}>{slide.emoji}</span>
        </div>
      </div>

      {/* Arrows */}
      <button className={"" + styles.arrow + " " + styles.arrowLeft} onClick={() => goTo(current - 1)} aria-label="Previous slide">‹</button>
      <button className={"" + styles.arrow + " " + styles.arrowRight} onClick={() => goTo(current + 1)} aria-label="Next slide">›</button>

      {/* Dots */}
      <div className={styles.dots} role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            className={"" + styles.dot + " " + (i === current ? styles.dotActive : "")}
            onClick={() => goTo(i)}
            aria-label={"Slide " + (i + 1)}
          />
        ))}
      </div>

      {/* Feature chips */}
      <div className={styles.chips} aria-hidden="true">
        {chips && chips.map((chip) => (
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
      {stats && stats.map((stat, i) => (
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
        <Link href={href || "/courses"} className={styles.cardTitle}>{title}</Link>
      </div>
    </div>
  );
}

// ── Community Banner (home page shortcut) ──────────────────────────────────
function CommunityBanner({ banner }) {
  if (!banner) return null;
  return (
    <section className={styles.communityBanner}>
      <div className={styles.communityBannerInner}>
        <div className={styles.communityBannerText}>
          <h2>{banner.heading}</h2>
          <p>{banner.description}</p>
        </div>
        <div className={styles.communityBannerActions}>
          <Link href="/community" className={styles.communityBannerBtn}>
            {banner.primaryBtn}
          </Link>
          <Link href="/register" className={styles.communityBannerSecondary}>
            {banner.secondaryBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Communities Row ────────────────────────────────────────────────────────
function CommunitiesRow({ headingMain, headingAccent, communities, viewAllHref }) {
  if (!communities) return null;
  return (
    <section className={styles.communitiesSection}>
      <div className={styles.sectionHeader}>
        <h2>
          {headingMain} <span className={styles.saffronText}>{headingAccent}</span>
        </h2>
        <Link href={viewAllHref || "/courses"} className={styles.viewAllBtn}>View All &gt;</Link>
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
function HowToJoin({ steps, headings }) {
  if (!steps || !headings) return null;
  return (
    <section className={styles.howToSection}>
      <h2 className={styles.howToHeading}>
        {headings.howToJoin} <span className={styles.saffronText}>{headings.howToJoinAccent}</span>
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
function ClusterGrid({ clusters, headings }) {
  if (!clusters || !headings) return null;
  return (
    <section className={styles.clusterSection}>
      <h2>{headings.chooseGroup} <span className={styles.saffronText}>{headings.chooseGroupAccent}</span> {headings.chooseGroupEnd}</h2>
      <div className={styles.clusterGrid}>
        {clusters.map((cluster, i) => (
          <div key={i} className={styles.clusterCard}>
            <span className={styles.clusterEmoji} aria-hidden="true">{cluster.emoji}</span>
            <h3>{cluster.name}</h3>
            <span className={styles.memberCount}>👥 {cluster.members}</span>
            <Link href="/register" className={styles.joinBtn}>➔</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Testimonial ────────────────────────────────────────────────────────────
function Testimonial({ quote, author, location }) {
  if (!quote) return null;
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
function FAQ({ questions, headings }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  if (!questions || !headings) return null;

  return (
    <section className={styles.faqSection}>
      <h2>
        {headings.faq} <span className={styles.saffronText}>{headings.faqAccent}</span>
      </h2>
      <div className={styles.faqList}>
        {questions.map((q, i) => (
          <div key={i} className={"" + styles.faqItem + " " + (openIndex === i ? styles.faqItemOpen : "")}>
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
  const locale = useLocale();
  const homeData = getHomeData(locale);
  
  if (!homeData) return null;

  const {
    hero, chips, stats,
    popularCommunities, newCommunities,
    steps, clusters, testimonial, faq, cta, footer, banner, headings
  } = homeData;

  return (
    <main className={styles.home}>
      <HeroCarousel slides={hero?.slides || []} chips={chips || []} />
      <StatsBar stats={stats || []} />
      <CommunityBanner banner={banner} />
      <CommunitiesRow
        headingMain={headings?.popular}
        headingAccent={headings?.courses}
        communities={popularCommunities}
        viewAllHref="/courses"
      />
      <CommunitiesRow
        headingMain={headings?.new}
        headingAccent={headings?.courses}
        communities={newCommunities}
        viewAllHref="/courses"
      />
      <HowToJoin steps={steps} headings={headings} />
      <ClusterGrid clusters={clusters} headings={headings} />
      <Testimonial {...testimonial} />
      <FAQ questions={faq} headings={headings} />

      {/* CTA Band */}
      {cta && (
        <section className={styles.ctaBand}>
          <h2>{cta.heading}</h2>
          <Link href="/register" className={styles.ctaBtn}>{cta.button}</Link>
        </section>
      )}

      {/* Footer */}
      {footer && (
        <footer className={styles.footer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <span className={styles.footerLogo}>{footer.logo}</span>
              <p>{footer.tagline}</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Quick Links</h4>
              {footer.links && footer.links.map((l, i) => (
                <Link key={i} href={l.href} className={styles.footerLink}>{l.label}</Link>
              ))}
            </div>
            <div className={styles.footerCol}>
              <h4>Help &amp; Support</h4>
              {footer.support && footer.support.map((l, i) => (
                <Link key={i} href={l.href} className={styles.footerLink}>{l.label}</Link>
              ))}
            </div>
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} {footer.logo}. All rights reserved.</p>
        </footer>
      )}
    </main>
  );
}
