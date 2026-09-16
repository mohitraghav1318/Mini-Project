import styles from "./Testimonial.module.scss";

/**
 * Layer 2 — Section Component
 * Single success story quote on a dark indigo background.
 */
export default function Testimonial({ quote, author, location }) {
  if (!quote) return null;

  return (
    <section className={styles.section} aria-label="Success story">
      <div className={styles.container}>
        <span className={styles.quoteIcon} aria-hidden="true">&ldquo;</span>
        <p className={styles.quote}>{quote}</p>
        <cite className={styles.author}>
          &mdash; {author}, {location}
        </cite>
      </div>
    </section>
  );
}
