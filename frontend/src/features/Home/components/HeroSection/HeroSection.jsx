"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./HeroSection.module.scss";

/**
 * Layer 2 — Section Component
 * Auto-rotating hero carousel with arrows, dots, and feature chips.
 */
export default function HeroSection({ slides = [], chips = [] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (index) => {
    clearInterval(timerRef.current);
    const next = (index + slides.length) % slides.length;
    setCurrent(next);
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      5000
    );
  };

  useEffect(() => {
    if (!slides.length) return;
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      5000
    );
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <section
      className={styles.hero}
      style={{ background: slide.bg }}
      aria-roledescription="carousel"
    >
      <div className={`${styles.inner} ${slide.textLight ? styles.light : styles.dark}`}>
        {/* Text */}
        <div className={styles.text}>
          <span className={styles.eyebrow}>{slide.eyebrow}</span>
          <h1 className={styles.heading}>
            {slide.heading}{" "}
            <span className={styles.accent}>{slide.accent}</span>
          </h1>
          <p className={styles.sub}>{slide.subheading}</p>
          <Link
            href="/register"
            className={`${styles.cta} ${slide.textLight ? styles.ctaLight : styles.ctaDark}`}
          >
            {slide.cta} →
          </Link>
        </div>

        {/* Graphic */}
        <div
          className={styles.graphic}
          style={{ background: slide.graphicBg }}
          aria-hidden="true"
        >
          <span className={styles.emoji}>{slide.emoji}</span>
        </div>
      </div>

      {/* Prev / Next */}
      <button
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => goTo(current - 1)}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => goTo(current + 1)}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className={styles.dots} role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Feature chips */}
      {chips.length > 0 && (
        <div className={styles.chips} aria-hidden="true">
          {chips.map((chip) => (
            <span key={chip.label} className={styles.chip}>
              <span>{chip.icon}</span>
              {chip.label}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
