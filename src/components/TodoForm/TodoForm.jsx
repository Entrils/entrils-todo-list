import { useState } from "react";
import styles from "./TodoForm.module.css";

function TodoForm({ addTodo, projects, tags, inputRef, defaultProject, onCancel }) {
  const [value, setValue] = useState("");
  const [project, setProject] = useState(defaultProject || "Inbox");
  const [tagInput, setTagInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(value, { project, tags: tagInput, priority, dueDate });
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Новая задача"
        />
        <button type="submit" className={styles.button}>
          Добавить
        </button>
        <button type="button" className={`${styles.button} ${styles.ghost}`} onClick={onCancel}>
          Отмена
        </button>
      </div>
      <details className={styles.metaPanel}>
        <summary className={styles.metaSummary}>Дополнительно</summary>
        <div className={styles.meta}>
          <input
            className={styles.input}
            list="projects"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Проект"
          />
          <datalist id="projects">
            {projects.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <input
            className={styles.input}
            list="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Теги через запятую"
          />
          <datalist id="tags">
            {tags.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
          <input
            className={styles.input}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </details>
    </form>
  );
}

export default TodoForm;
