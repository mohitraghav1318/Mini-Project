"use client";

import { useState } from "react";
import styles from "./FaqSection.module.scss";

/**
 * Layer 2 — Section Component
 * Accessible expand/collapse FAQ accordion.
 */
export default function FaqSection({ questions = [], headings = {} }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  if (!questions.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          {headings.faq}{" "}
          <span className={styles.accent}>{headings.faqAccent}</span>
        </h2>

        <div className={styles.list}>
          {questions.map((q, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
              >
                <button
                  className={styles.question}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span>{q.question}</span>
                  <span className={styles.toggle} aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className={styles.answer}>
                    <p>{q.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
