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

      const activeElement = document.activeElement;
      const inEditable = isEditableElement(activeElement);

      if (event.key === "Escape") {
        if (showComposer) {
          event.preventDefault();
          closeComposer();
        }
        return;
      }

      if (event.key === "/" && !inEditable) {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      if ((event.key === "n" || event.key === "N") && !inEditable) {
        event.preventDefault();
        if (!showComposer) {
          openComposer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showComposer, openComposer, closeComposer]);

  useEffect(() => {
    if (!shellRef.current) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          duration: 0.52,
          ease: "power3.out",
        },
      });

      tl.fromTo(
        "[data-anim-shell='sidebar']",
        { x: -30, autoAlpha: 0 },
        { x: 0, autoAlpha: 1 }
      ).fromTo(
        "[data-anim-shell='workspace']",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1 },
        "-=0.36"
      );
    }, shellRef);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const blobs = [meshARef.current, meshBRef.current, meshCRef.current].filter(Boolean);
    if (!blobs.length) return undefined;

    const tweenA = gsap.to(blobs[0], {
      x: 48,
      y: 32,
      scale: 1.06,
      duration: 12,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    const tweenB = gsap.to(blobs[1], {
      x: -44,
      y: 24,
      scale: 0.96,
      duration: 14,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    const tweenC = gsap.to(blobs[2], {
      x: 22,
      y: -26,
      scale: 1.08,
      duration: 16,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tweenA.kill();
      tweenB.kill();
      tweenC.kill();
    };
  }, []);

  useEffect(() => {
    if (!shellRef.current) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !finePointer || window.innerWidth < 1100) return undefined;

    const sidebar = sidebarShellRef.current;
    const workspace = workspaceCardRef.current;
    const mesh = meshBackdropRef.current;
    if (!sidebar || !workspace || !mesh) return undefined;

    const sideX = gsap.quickTo(sidebar, "x", { duration: 0.38, ease: "power2.out" });
    const sideY = gsap.quickTo(sidebar, "y", { duration: 0.38, ease: "power2.out" });
    const workX = gsap.quickTo(workspace, "x", { duration: 0.4, ease: "power2.out" });
    const workY = gsap.quickTo(workspace, "y", { duration: 0.4, ease: "power2.out" });
    const meshX = gsap.quickTo(mesh, "x", { duration: 0.44, ease: "power2.out" });
    const meshY = gsap.quickTo(mesh, "y", { duration: 0.44, ease: "power2.out" });

    const handleMove = (event) => {
      const rect = shellRef.current.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      sideX(px * 2.4);
      sideY(py * 1.6);
      workX(px * -3.2);
      workY(py * -2.2);
      meshX(px * -9.5);
      meshY(py * -6.4);
    };

    const handleLeave = () => {
      sideX(0);
      sideY(0);