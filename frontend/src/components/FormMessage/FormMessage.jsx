import styles from "./FormMessage.module.scss";

export default function FormMessage({ type = "error", message }) {
  if (!message) return null;

  return (
    <div className={`${styles.message} ${styles[type]}`} role="alert">
      {message}
    </div>
  );
}
