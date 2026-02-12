import styles from "./Sidebar.module.css";

function Sidebar({
  search,
  onSearchChange,
  onAdd,
  navActive,
  onNavSelect,
  projects,
  projectActive,
  onProjectSelect,
  onProjectReset,
  menuActive,
  onMenuToggle,
  onThemeToggle,
  themeLabel,
  projectColors,
}) {
  const itemClass = (active) =>
    active ? `${styles.item} ${styles.itemActive}` : styles.item;

  return (
    <aside className={styles.sidebar}>
      <button type="button" className={styles.addCta} onClick={onAdd}>
        + Добавить задачу
      </button>

      <div className={styles.section}>
        <div className={styles.title}>Поиск</div>
        <input
          className={styles.search}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск"
        />
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Навигация</div>
        <button
          className={itemClass(navActive === "all")}
          onClick={() => onNavSelect("all")}
        >
          Все
        </button>
        <button
          className={itemClass(navActive === "today")}
          onClick={() => onNavSelect("today")}
        >
          Сегодня
        </button>
        <button
          className={itemClass(navActive === "upcoming")}
          onClick={() => onNavSelect("upcoming")}
        >
          Предстоящие
        </button>
        <button
          className={itemClass(navActive === "overdue")}
          onClick={() => onNavSelect("overdue")}
        >
          Просрочено
        </button>
        <button
          className={itemClass(navActive === "completed")}
          onClick={() => onNavSelect("completed")}
        >
          Выполненные
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Проекты</div>
        <div className={styles.list}>
          {projects.map((project, index) => (
            <button
              key={project}
              className={itemClass(projectActive === project)}
              onClick={() => onProjectSelect(project)}
            >
              <span
                className={styles.dot}
                style={{ background: projectColors[index % projectColors.length] }}
              />
              {project}
            </button>
          ))}
          <button
            className={`${styles.item} ${styles.itemGhost}`}
            onClick={onProjectReset}
          >
            Сбросить проекты
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Меню</div>
        <button className={itemClass(menuActive)} onClick={onMenuToggle}>
          Проекты и теги
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Тема</div>
        <button type="button" className={styles.item} onClick={onThemeToggle}>
          Тема: {themeLabel}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
