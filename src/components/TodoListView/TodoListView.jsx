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
    xTo: null,
    yTo: null,
  });
  const transparentDragImageRef = useRef(null);

  const [dropTarget, setDropTarget] = useState({ columnId: null, beforeId: null });
  const [dragActive, setDragActive] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSkeleton(false);
    }, 430);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const grouped = useMemo(() => {
    const initial = {
      todo: [],
      in_progress: [],
      done: [],
    };

    todos.forEach((todo) => {
      const stage = resolveStage(todo);
      if (!initial[stage]) {
        initial.todo.push(todo);
        return;
      }

      initial[stage].push(todo);
    });

    return {
      todo: initial.todo.sort(sortByOrder),
      in_progress: initial.in_progress.sort(sortByOrder),
      done: initial.done.sort(sortByOrder),
    };
  }, [todos]);

  const clearDropTarget = () => {
    setDropTarget({ columnId: null, beforeId: null });
  };

  const cleanupDragPreview = useCallback((withAnimation = true) => {
    const state = dragStateRef.current;

    if (state.source) {
      gsap.killTweensOf(state.source);
      gsap.to(state.source, {
        scale: 1,
        opacity: 1,
        duration: 0.16,
        ease: "power2.out",
        clearProps: "transform,opacity",
      });
    }

    if (state.mirror) {
      gsap.killTweensOf(state.mirror);

      if (withAnimation) {
        gsap.to(state.mirror, {
          scale: 0.88,
          opacity: 0,
          duration: 0.16,
          ease: "power2.in",
          onComplete: () => {
            state.mirror?.remove();
          },
        });
      } else {
        state.mirror.remove();
      }
    }

    dragStateRef.current = {
      mirror: null,
      source: null,
      offsetX: 0,
      offsetY: 0,
      xTo: null,
      yTo: null,
    };
  }, []);

  const resetDragState = useCallback(
    (withAnimation = true) => {
      clearDropTarget();
      setDragActive(false);
      cleanupDragPreview(withAnimation);
    },
    [cleanupDragPreview]
  );

  useEffect(() => {
    return () => {
      cleanupDragPreview(false);
    };
  }, [cleanupDragPreview]);

  useEffect(() => {
    const forceReset = () => {
      resetDragState(false);
    };

    window.addEventListener("dragend", forceReset);
    window.addEventListener("drop", forceReset);
    window.addEventListener("mouseup", forceReset);
    window.addEventListener("touchend", forceReset);

    return () => {
      window.removeEventListener("dragend", forceReset);
      window.removeEventListener("drop", forceReset);
      window.removeEventListener("mouseup", forceReset);
      window.removeEventListener("touchend", forceReset);
    };
  }, [resetDragState]);

  useLayoutEffect(() => {
    const boardNode = boardRef.current;
    if (!boardNode) return undefined;

    return () => {
      const cards = boardNode.querySelectorAll("[data-flip-card='true']");
      if (cards.length > 0) {
        flipStateRef.current = Flip.getState(cards);
      }
    };
  }, [todos]);

  useLayoutEffect(() => {
    if (!flipStateRef.current || !boardRef.current) return;

    Flip.from(flipStateRef.current, {
      duration: 0.38,
      ease: "power2.out",
      absolute: false,
      prune: true,
      simple: true,
      stagger: 0.02,
    });

    flipStateRef.current = null;
  }, [todos]);

  useEffect(() => {
    if (!boardRef.current) return undefined;

    const columnsList = boardRef.current.querySelectorAll("[data-board-column]");
    gsap.fromTo(
      columnsList,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.48,
        ease: "power2.out",
        stagger: 0.06,
      }
    );
    return undefined;
  }, []);

  useEffect(() => {
    if (!boardRef.current) return;

    const cards = boardRef.current.querySelectorAll("[data-flip-card='true']");
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { y: 8, scale: 0.99 },
      {
        y: 0,
        scale: 1,
        duration: 0.26,
        ease: "power2.out",
        stagger: 0.02,
        overwrite: "auto",
      }
    );
  }, [todos]);

  useEffect(() => {
    if (!boardRef.current) return;

    const stageMap = new Map();

    todos.forEach((todo) => {
      const stage = resolveStage(todo);
      stageMap.set(todo.id, stage);

      const prevStage = prevStagesRef.current.get(todo.id);
      if (prevStage && prevStage !== "done" && stage === "done") {
        const target = boardRef.current.querySelector(`[data-todo-card='${todo.id}']`);
        if (!target) return;

        gsap
          .timeline()
          .to(target, {
            scale: 1.045,
            boxShadow: "0 0 0 8px rgba(49, 168, 106, 0.22)",
            duration: 0.18,
            ease: "power2.out",
          })
          .to(target, {
            scale: 1,
            boxShadow: "0 7px 18px rgba(8, 22, 30, 0.06)",
            duration: 0.32,
            ease: "elastic.out(1, 0.55)",
          });
      }
    });

    prevStagesRef.current = stageMap;
  }, [todos]);

  useEffect(() => {
    if (!boardRef.current || pendingDropIdRef.current === null) return;

    const target = boardRef.current.querySelector(
      `[data-todo-card='${pendingDropIdRef.current}']`
    );

    if (target) {
      gsap.fromTo(
        target,
        { y: -12, scale: 1.03 },
        {
          y: 0,
          scale: 1,
          duration: 0.46,
          ease: "elastic.out(1, 0.56)",
        }
      );
    }

    pendingDropIdRef.current = null;
  }, [todos]);

  const moveDragPreview = (event) => {
    const state = dragStateRef.current;
    if (!state.mirror) return;

    const x = event.clientX - state.offsetX + 18;
    const y = event.clientY - state.offsetY + 14;

    state.xTo?.(x);
    state.yTo?.(y);
  };

  const handleCardDragStart = (event, id) => {
    if (!event.dataTransfer) return;

    const source = event.currentTarget;
    const rect = source.getBoundingClientRect();

    if (!transparentDragImageRef.current) {
      const image = new Image();
      image.src = transparentImageSrc;
      transparentDragImageRef.current = image;
    }

    setDragActive(true);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(id));
    event.dataTransfer.setDragImage(transparentDragImageRef.current, 0, 0);

    const mirror = source.cloneNode(true);
    mirror.classList.add(styles.dragMirror);
    mirror.style.width = `${rect.width}px`;
    mirror.style.height = `${rect.height}px`;
    document.body.appendChild(mirror);

    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    gsap.set(mirror, {
      x: event.clientX - offsetX + 18,
      y: event.clientY - offsetY + 14,
      scale: 0.94,
      rotate: -1.2,
      opacity: 0,
    });

    gsap.to(mirror, {
      scale: 1,
      rotate: -0.4,
      opacity: 0.96,
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(source, {
      scale: 0.98,
      opacity: 0.28,
      duration: 0.16,
      ease: "power2.out",
    });

    dragStateRef.current = {
      mirror,
      source,
      offsetX,
      offsetY,
      xTo: gsap.quickTo(mirror, "x", { duration: 0.12, ease: "power3.out" }),
      yTo: gsap.quickTo(mirror, "y", { duration: 0.12, ease: "power3.out" }),
    };
  };

  const handleCardDragEnd = () => {
    resetDragState(true);
  };

  const handleDrop = (event, columnId, beforeId = null) => {
    event.preventDefault();
    event.stopPropagation();

    const rawId = event.dataTransfer.getData("text/plain");
    const id = Number(rawId);
    if (Number.isNaN(id)) {
      resetDragState(true);
      return;
    }

    if (beforeId === id) {
      resetDragState(true);
      return;
    }

    pendingDropIdRef.current = id;
    onMove(id, columnId, beforeId);
    resetDragState(true);
  };

  return (
    <section ref={boardRef} className={styles.board}>
      {columns.map((column) => (
        <div
          key={column.id}