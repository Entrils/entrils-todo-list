import styles from "./ThemeToggle.module.css";

function ThemeToggle({ label, onNextTheme }) {
  return (
    <button className={styles.button} onClick={onNextTheme}>
      Тема: {label}
    </button>
  );
}

export default ThemeToggle;
