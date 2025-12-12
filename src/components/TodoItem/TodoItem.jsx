import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import { gsap } from "gsap";
import { formatDate } from "../../utils/formatDate/formatDate.js";
import styles from "./TodoItem.module.css";

const priorityLabels = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getInitials = (source) => {
  if (!source) return "NB";

  const parts = source
    .split(/[\s_-]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((item) => item[0].toUpperCase()).join("") || "NB";
};

const TodoItem = forwardRef(function TodoItem(
  {
    todo,
    toggleTodo,
    deleteTodo,
    editTodo,
    onDragStart,
    onDragEnd,
    onDragOverCard,
    onDropCard,
    isDropTarget,
  },
  ref
) {
  const localRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const setRefs = useCallback(
    (node) => {
      localRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  useEffect(() => {
    if (!localRef.current) return;

    const item = localRef.current;
    gsap.fromTo(
      item,
      { y: 10, scale: 0.985 },
      {
        y: 0,
        scale: 1,
        duration: 0.24,
        ease: "power2.out",
      }
    );
  }, [todo.id]);

  useEffect(() => {
    if (!localRef.current) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const item = localRef.current;

    const onEnter = () => {
      if (isEditing) return;
      gsap.to(item, {
        y: -3,
        scale: 1.01,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const onMove = (event) => {
      if (isEditing) return;
      if (event.pointerType && event.pointerType !== "mouse") return;

      const rect = item.getBoundingClientRect();
      const rx = (event.clientX - rect.left) / rect.width;
      const ry = (event.clientY - rect.top) / rect.height;

      const rotateY = gsap.utils.clamp(-3.2, 3.2, (rx - 0.5) * 6.4);
      const rotateX = gsap.utils.clamp(-3.2, 3.2, (0.5 - ry) * 6.4);

      item.style.setProperty("--glow-x", `${Math.round(rx * 100)}%`);
      item.style.setProperty("--glow-y", `${Math.round(ry * 100)}%`);

      gsap.to(item, {
        rotateX,
        rotateY,
        transformPerspective: 900,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(item, {
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 0.22,
        ease: "power2.out",
      });
    };

    item.addEventListener("pointerenter", onEnter);
    item.addEventListener("pointermove", onMove);
    item.addEventListener("pointerleave", onLeave);

    const buttons = item.querySelectorAll("[data-card-magnetic='true']");
    const buttonListeners = [];

    buttons.forEach((button) => {
      const onButtonMove = (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
          x: gsap.utils.clamp(-5, 5, x * 0.25),
          y: gsap.utils.clamp(-3, 3, y * 0.25),
          scale: 1.02,
          duration: 0.14,
          ease: "power2.out",
        });
      };

      const onButtonLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.16,
          ease: "power2.out",
        });
      };

      button.addEventListener("pointermove", onButtonMove);
      button.addEventListener("pointerleave", onButtonLeave);
      buttonListeners.push([button, onButtonMove, onButtonLeave]);
    });

    return () => {
      item.removeEventListener("pointerenter", onEnter);
      item.removeEventListener("pointermove", onMove);
      item.removeEventListener("pointerleave", onLeave);
      buttonListeners.forEach(([button, onButtonMove, onButtonLeave]) => {
        button.removeEventListener("pointermove", onButtonMove);
        button.removeEventListener("pointerleave", onButtonLeave);
      });
    };
  }, [isEditing, todo.id]);

  const handleEdit = () => {
    if (isEditing) {
      if (newText.trim() === "") return;
      editTodo(todo.id, newText);
    }

    setIsEditing((current) => !current);
  };

  const dueInfo = useMemo(() => {
    if (!todo.dueDate) {
      return { label: "Без даты", status: "none" };
    }

    const today = startOfDay(new Date());
    const due = startOfDay(new Date(todo.dueDate));

    if (!todo.completed && due < today) {
      return {
        label: `Просрочено: ${new Date(todo.dueDate).toLocaleDateString()}`,
        status: "overdue",
      };
    }

    if (due.getTime() === today.getTime()) {
      return {
        label: `Сегодня: ${new Date(todo.dueDate).toLocaleDateString()}`,
        status: "today",
      };
    }

    return {
      label: `Срок: ${new Date(todo.dueDate).toLocaleDateString()}`,
      status: "upcoming",
    };
  }, [todo.completed, todo.dueDate]);

  return (
    <article
      ref={setRefs}
      data-todo-card={todo.id}
      data-flip-card="true"
      className={`${styles.item} ${styles[`priority_${todo.priority || "medium"}`]} ${todo.completed ? styles.completed : ""} ${isDropTarget ? styles.dropTarget : ""}`}
      draggable={!isEditing}
      onDragStart={(event) => onDragStart?.(event, todo.id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOverCard}
      onDrop={onDropCard}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.issueId}>Task-{todo.id}</p>
          {isEditing ? (
            <input