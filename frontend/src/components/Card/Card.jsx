import styles from "./Card.module.scss";

export default function Card({ children, className = "" }) {
  return <div className={`${styles.card} ${className}`.trim()}>{children}</div>;
}
