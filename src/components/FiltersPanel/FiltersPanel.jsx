import styles from "./FiltersPanel.module.css";

function FiltersPanel({ tagFilter, tags, onTagChange, priorityFilter, onPriorityChange, dueFilter, onDueChange }) {
  return (
    <details className={styles.panel}>
      <summary className={styles.summary}>Фильтры</summary>
      <div className={styles.filters}>
        <label className={styles.label}>
          Тег
          <select className={styles.select} value={tagFilter} onChange={(e) => onTagChange(e.target.value)}>
            <option value="all">Все</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Приоритет
          <select className={styles.select} value={priorityFilter} onChange={(e) => onPriorityChange(e.target.value)}>
            <option value="all">Любой</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </label>
        <label className={styles.label}>
          Дедлайн
          <select className={styles.select} value={dueFilter} onChange={(e) => onDueChange(e.target.value)}>
            <option value="any">Любой</option>
            <option value="today">Сегодня</option>
            <option value="overdue">Просрочено</option>
            <option value="upcoming">Будущее</option>
            <option value="none">Без даты</option>
          </select>
        </label>
      </div>
    </details>
  );
}

export default FiltersPanel;
