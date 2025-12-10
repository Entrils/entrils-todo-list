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