import { useState, useEffect } from "react";
import TodoList from "./components/TodoList/TodoList.jsx";
import TodoForm from "./components/TodoForm/TodoForm.jsx";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle.jsx";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // сохраняем список задач в localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // сохраняем тему в localStorage
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // добавление задачи
const addTodo = (text) => {
  if (text.trim() === "") return;
  setTodos([
    ...todos,
    {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(), // сохраняем в ISO
    },
  ]);
};

  // переключение выполнения задачи
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // удаление задачи
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // редактирование задачи
  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // очистить все выполненные
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // фильтрация
  let filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // сортировка: активные выше выполненных
  filteredTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  // счётчик оставшихся
  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app">
      <div className="header">
        <h1>Entrils to-do лист</h1>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <TodoForm addTodo={addTodo} />

      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Все
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Активные
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Выполненные
        </button>
      </div>

      <TodoList
        todos={filteredTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
      />

      <div className="footer">
        <div className="counter">
          Осталось задач: <b>{activeCount}</b>
        </div>
        <button className="clear-btn" onClick={clearCompleted}>
          Удалить выполненные
        </button>
      </div>
    </div>
  );
}

export default App;