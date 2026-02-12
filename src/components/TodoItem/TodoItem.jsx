import { useState, forwardRef } from "react";
import { formatDate } from "../../utils/formatDate/formatDate.js";
import styles from "./TodoItem.module.css";

const priorityLabels = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const TodoItem = forwardRef(function TodoItem(
  { todo, toggleTodo, deleteTodo, editTodo },
  ref
) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing) {
      if (newText.trim() === "") return;
      editTodo(todo.id, newText);
    }
    setIsEditing(!isEditing);
  };

  let dueStatus = "";
  if (todo.dueDate) {
    const today = startOfDay(new Date());
    const due = startOfDay(new Date(todo.dueDate));
    if (!todo.completed && due < today) dueStatus = "overdue";
    else if (due.getTime() === today.getTime()) dueStatus = "today";
    else if (due > today) dueStatus = "upcoming";
  }

  const dueLabel = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString()
    : "";

  const dueClass =
    dueStatus === "overdue"
      ? styles.dueOverdue
      : dueStatus === "today"
      ? styles.dueToday
      : dueStatus === "upcoming"
      ? styles.dueUpcoming
      : "";

  return (
    <div
      ref={ref}
      className={`${styles.item} ${todo.completed ? styles.completed : ""} ${dueClass}`}
    >
      <div className={styles.content}>
        <span className={styles.checkbox}>{todo.completed ? "✔️" : "⬜"}</span>

        {isEditing ? (
          <input
            className={styles.editInput}
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        ) : (
          <span className={todo.completed ? styles.completedText : styles.contentText}>
            {todo.text}
          </span>
        )}
      </div>

      <div className={styles.meta}>
        <span className={styles.badge}>{todo.project || "Inbox"}</span>
        <span
          className={`${styles.badge} ${
            todo.priority === "high"
              ? styles.badgePriorityHigh
              : todo.priority === "low"
              ? styles.badgePriorityLow
              : styles.badgePriorityMedium
          }`}
        >
          {priorityLabels[todo.priority || "medium"]}
        </span>
        {(todo.tags || []).map((tag) => (
          <span key={tag} className={`${styles.badge} ${styles.badgeTag}`}>
            #{tag}
          </span>
        ))}
        {todo.dueDate ? (
          <span
            className={`${styles.badge} ${styles.badgeDue} ${
              dueStatus === "overdue" ? styles.badgeDueOverdue : ""
            }`}
          >
            до {dueLabel}
          </span>
        ) : null}
        {dueStatus === "overdue" ? (
          <span className={`${styles.badge} ${styles.badgeOverdue}`}>Просрочено</span>
        ) : null}
      </div>

      <small className={styles.timestamp}>Создано: {formatDate(todo.createdAt)}</small>

      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleEdit}
        >
          {isEditing ? "Сохранить" : "Редакт."}
        </button>
        <button className={styles.button} onClick={() => toggleTodo(todo.id)}>
          {todo.completed ? "Отменить" : "Выполнено"}
        </button>
        <button
          className={`${styles.button} ${styles.buttonDanger}`}
          onClick={() => deleteTodo(todo.id)}
        >
          Удалить
        </button>
      </div>
    </div>
  );
});

export default TodoItem;
