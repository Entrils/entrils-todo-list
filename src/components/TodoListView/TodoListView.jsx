import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/flip";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import TodoItem from "../TodoItem/TodoItem.jsx";
import styles from "./TodoListView.module.css";

gsap.registerPlugin(Flip);

const columns = [
  { id: "todo", title: "To Do", hint: "Подготовка", tone: "todo" },
  {
    id: "in_progress",
    title: "In Progress",
    hint: "В работе",
    tone: "inProgress",
  },
  { id: "done", title: "Done", hint: "Завершено", tone: "done" },
];

const transparentImageSrc =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const resolveStage = (todo) => {
  if (todo.stage) return todo.stage;
  return todo.completed ? "done" : "todo";
};

const sortByOrder = (left, right) => {
  const leftOrder = Number.isFinite(left.order) ? left.order : Number.MAX_SAFE_INTEGER;
  const rightOrder = Number.isFinite(right.order)
    ? right.order
    : Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
};

function AnimatedCount({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const model = {
      value: Number(ref.current.textContent || 0),
    };

    const tween = gsap.to(model, {
      value,
      duration: 0.36,
      ease: "power2.out",
      onUpdate: () => {
        if (!ref.current) return;
        ref.current.textContent = String(Math.round(model.value));
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}

function TodoListView({ todos, getNodeRef, onToggle, onDelete, onEdit, onMove }) {
  const boardRef = useRef(null);
  const flipStateRef = useRef(null);
  const prevStagesRef = useRef(new Map());
  const pendingDropIdRef = useRef(null);

  const dragStateRef = useRef({
    mirror: null,
    source: null,
    offsetX: 0,
    offsetY: 0,