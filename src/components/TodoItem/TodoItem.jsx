import { useState } from "react";
import { formatDate } from "../../utils/formatDate/formatDate.js";

function TodoItem({ todo, toggleTodo, deleteTodo, editTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing) {
      editTodo(todo.id, newText);
    }
    setIsEditing(!isEditing);
  };

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content">
        <span className="checkbox">{todo.completed ? "✔️" : "⬜"}</span>

        {isEditing ? (
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        ) : (
          <span>{todo.text}</span>
        )}
      </div>

      <small className="timestamp">{formatDate(todo.createdAt)}</small>

      <div className="buttons">
        <button onClick={handleEdit}>{isEditing ? "Сохранить" : "Редакт."}</button>
        <button onClick={() => toggleTodo(todo.id)}>
          {todo.completed ? "Отменить" : "Выполнено"}
        </button>
        <button onClick={() => deleteTodo(todo.id)}>Удалить</button>
      </div>
    </li>
  );
}

export default TodoItem;