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