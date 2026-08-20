import styles from "./BorderMotif.module.scss";

export default function BorderMotif({ flip = false }) {
  return (
    <div
      className={`${styles.motif} ${flip ? styles.flip : ""}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}
