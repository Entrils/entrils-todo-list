import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigationHandlers } from "./hooks/useNavigationHandlers.js";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import HeaderBar from "./components/HeaderBar/HeaderBar.jsx";
import FiltersPanel from "./components/FiltersPanel/FiltersPanel.jsx";
import TodoForm from "./components/TodoForm/TodoForm.jsx";
import TodoListView from "./components/TodoListView/TodoListView.jsx";
import useTodos from "./hooks/useTodos.js";
import useLibraryState from "./hooks/useLibraryState.js";
import useTheme from "./hooks/useTheme.js";
import useFilters from "./hooks/useFilters.js";
import { THEMES, PROJECT_COLORS } from "./config.js";
import styles from "./App.module.css";

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

function App() {
  const shellRef = useRef(null);
  const meshBackdropRef = useRef(null);
  const meshARef = useRef(null);
  const meshBRef = useRef(null);
  const meshCRef = useRef(null);
  const sidebarShellRef = useRef(null);
  const workspaceShellRef = useRef(null);
  const workspaceCardRef = useRef(null);
  const inputRef = useRef(null);
  const searchInputRef = useRef(null);
  const composerRef = useRef(null);

  const {
    filter,
    search,
    projectFilter,
    tagFilter,
    priorityFilter,
    dueFilter,
    setFilter,
    setSearch,
    setProjectFilter,
    setTagFilter,
    setPriorityFilter,
    setDueFilter,
  } = useFilters();

  const [dragFocus, setDragFocus] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  const { theme, setTheme, activeTheme, handleThemeNext } = useTheme({
    themes: THEMES,
    defaultTheme: "linen",
  });

  const {
    nodeRefs,
    todos,
    projects,
    tags,
    addTodo,
    moveTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
  } = useLibraryState({ themes: THEMES, theme, setTheme });

  const { filteredTodos, navActive, projectActive } = useTodos({
    todos,
    filter,
    projectFilter,
    tagFilter,
    priorityFilter,
    dueFilter,
    search,
    showComposer,
  });

  const navStats = useMemo(() => {
    const today = startOfDay(new Date());

    const stats = {
      all: todos.length,
      today: 0,
      upcoming: 0,
      overdue: 0,
      completed: 0,
    };

    todos.forEach((todo) => {
      if (todo.completed) {
        stats.completed += 1;
      }

      if (!todo.dueDate || todo.completed) {
        return;
      }

      const due = startOfDay(new Date(todo.dueDate));
      if (due.getTime() === today.getTime()) stats.today += 1;
      if (due > today) stats.upcoming += 1;
      if (due < today) stats.overdue += 1;
    });

    return stats;
  }, [todos]);

  const {
    openComposer,
    closeComposer,
    handleNavSelect,
    handleProjectSelect,
    handleProjectReset,
  } = useNavigationHandlers({
    inputRef,
    setShowComposer,
    setFilter,
    setDueFilter,
    setProjectFilter,
  });

  useEffect(() => {
    const isEditableElement = (target) => {
      if (!(target instanceof HTMLElement)) return false;

      const tag = target.tagName;
      return (
        target.isContentEditable ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT"
      );
    };

    const handleKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
