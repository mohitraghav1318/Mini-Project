import styles from "./HowToJoin.module.scss";

/**
 * Layer 2 — Section Component
 * Four numbered step cards showing how to get started.
 */
export default function HowToJoin({ steps = [], headings = {} }) {
  if (!steps.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          {headings.howToJoin}{" "}
          <span className={styles.accent}>{headings.howToJoinAccent}</span>
        </h2>
        <div className={styles.grid}>
          {steps.map((step, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.badge}>{i + 1}</div>
              <div className={styles.iconWrap} aria-hidden="true">
                {step.icon}
              </div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.desc}>{step.description}</p>
              <div className={styles.bar} aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
