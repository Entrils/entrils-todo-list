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