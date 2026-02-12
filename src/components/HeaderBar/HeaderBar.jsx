import styles from "./HeaderBar.module.css";

function HeaderBar({ title, subtitle }) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}

export default HeaderBar;
