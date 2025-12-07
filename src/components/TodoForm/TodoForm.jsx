import { useState } from "react";
import styles from "./TodoForm.module.css";

function TodoForm({ addTodo, projects, tags, inputRef, defaultProject, onCancel }) {
  const [value, setValue] = useState("");
  const [project, setProject] = useState(defaultProject || "Inbox");
  const [tagInput, setTagInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [stage, setStage] = useState("todo");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    addTodo(value, { project, tags: tagInput, priority, dueDate, stage });
    setValue("");
    setTagInput("");
    setPriority("medium");
    setStage("todo");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.primaryRow}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Что нужно сделать?"
        />
        <button type="submit" className={styles.button}>
          Создать
        </button>
        <button type="button" className={`${styles.button} ${styles.ghost}`} onClick={onCancel}>
          Отмена
        </button>
      </div>

      <div className={styles.metaGrid}>
        <label className={styles.field}>
          Проект
          <input
            className={styles.input}
            list="projects"
            value={project}
            onChange={(event) => setProject(event.target.value)}
            placeholder="Проект"
          />
        </label>
        <datalist id="projects">
          {projects.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>

        <label className={styles.field}>
          Теги
          <input
            className={styles.input}
            list="tags"
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            placeholder="frontend, review"
          />
        </label>
        <datalist id="tags">
          {tags.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>

        <label className={styles.field}>
          Приоритет
          <select className={styles.select} value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </label>

        <label className={styles.field}>
          Колонка
          <select className={styles.select} value={stage} onChange={(event) => setStage(event.target.value)}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className={styles.field}>
          Дедлайн
          <input
            className={styles.input}
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </label>
      </div>
    </form>
  );
}

export default TodoForm;

