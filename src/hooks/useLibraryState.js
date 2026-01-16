import { useEffect, useRef, useState } from "react";
import usePersistentState from "../hooks/usePersistentState.js";
import {
  BOARD_STAGES,
  normalizeStage,
  unique,
  normalizeTags,
  parseImportPayload,
} from "../utils/todoData.js";

const safeOrder = (value) =>
  Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;

const sortByOrder = (left, right) => {
  const byOrder = safeOrder(left.order) - safeOrder(right.order);
  if (byOrder !== 0) return byOrder;

  return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
};

const normalizeTodo = (todo) => {
  const stage = normalizeStage(todo.stage, Boolean(todo.completed));

  return {
    ...todo,
    stage,
    completed: stage === "done",
    project: todo.project || "Inbox",
    tags: Array.isArray(todo.tags) ? todo.tags : [],
    order: safeOrder(todo.order),
  };
};

const buildStageGroups = (todos) => {
  const groups = {
    todo: [],
    in_progress: [],
    done: [],
  };

  todos.forEach((todo) => {
    const normalized = normalizeTodo(todo);
    groups[normalized.stage].push(normalized);
  });

  BOARD_STAGES.forEach((stage) => {
    groups[stage].sort(sortByOrder);
  });

  return groups;
};

const flattenStageGroups = (groups) =>
  BOARD_STAGES.flatMap((stage) =>
    groups[stage].map((todo, index) => ({
      ...todo,
      stage,
      completed: stage === "done",
      order: index + 1,
    }))
  );

const normalizeCollection = (todos) =>
  flattenStageGroups(buildStageGroups(todos));

const relocateTodo = (todos, id, targetStage, beforeId = null) => {
  const groups = buildStageGroups(todos);
  let movingTodo = null;

  BOARD_STAGES.forEach((stage) => {
    const index = groups[stage].findIndex((todo) => todo.id === id);
    if (index === -1) return;

    movingTodo = groups[stage][index];
    groups[stage].splice(index, 1);
  });

  if (!movingTodo) {
    return flattenStageGroups(groups);
  }

  const nextStage = normalizeStage(targetStage, false);
  const targetList = groups[nextStage];
  let insertIndex = targetList.length;

  if (beforeId !== null && beforeId !== undefined && beforeId !== id) {
    const beforeIndex = targetList.findIndex((todo) => todo.id === beforeId);
    if (beforeIndex >= 0) {
      insertIndex = beforeIndex;
    }
  }

  targetList.splice(insertIndex, 0, {
    ...movingTodo,
    stage: nextStage,
    completed: nextStage === "done",
  });

  return flattenStageGroups(groups);
};

function useLibraryState({ themes, theme, setTheme }) {
  const nodeRefs = useRef(new Map());
  const importRef = useRef(null);

  const [todos, setTodos] = usePersistentState("todos", []);
  const [projects, setProjects] = usePersistentState("projects", ["Inbox"]);
  const [tags, setTags] = usePersistentState("tags", []);

  const [newProject, setNewProject] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const ids = new Set(todos.map((todo) => todo.id));
    for (const key of nodeRefs.current.keys()) {
      if (!ids.has(key)) nodeRefs.current.delete(key);
    }
  }, [todos]);

  useEffect(() => {
    setTodos((current) => normalizeCollection(current));
  }, [setTodos]);

  const addProject = () => {
    const trimmed = newProject.trim();
    if (!trimmed) return;
    if (projects.includes(trimmed)) return;
    setProjects(["Inbox", ...projects.filter((p) => p !== "Inbox"), trimmed]);
    setNewProject("");
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setNewTag("");
  };

  const removeProject = (project) => {
    if (project === "Inbox") return;

    setProjects((current) => current.filter((item) => item !== project));
    setTodos((current) =>
      normalizeCollection(
        current.map((todo) =>
          todo.project === project ? { ...todo, project: "Inbox" } : todo
        )
      )
    );
  };

  const removeTag = (tag) => {
    setTags((current) => current.filter((item) => item !== tag));
    setTodos((current) =>
      normalizeCollection(
        current.map((todo) => ({
          ...todo,
          tags: (todo.tags || []).filter((item) => item !== tag),
        }))
      )
    );
  };

  const addTodo = (text, meta) => {
    const trimmed = text.trim();
    if (trimmed === "") return false;

    const project = (meta.project || "").trim() || "Inbox";
    const todoTags = normalizeTags(meta.tags);
    const stage = normalizeStage(meta.stage, false);

    if (!projects.includes(project)) {
      setProjects((current) => [...current, project]);
    }

    const nextTags = unique([...tags, ...todoTags]);
    if (nextTags.length !== tags.length) {
      setTags(nextTags);
    }

    setTodos((current) =>
      normalizeCollection([
        ...current,
        {
          id: Date.now(),
          text: trimmed,
          completed: stage === "done",
          createdAt: new Date().toISOString(),
          project,
          tags: todoTags,
          priority: meta.priority || "medium",
          dueDate: meta.dueDate || "",
          stage,
          order: Number.MAX_SAFE_INTEGER,
        },
      ])
    );

    return true;
  };

  const moveTodo = (id, stage, beforeId = null) => {
    const nextStage = normalizeStage(stage, false);

    setTodos((current) => relocateTodo(current, id, nextStage, beforeId));
  };

  const toggleTodo = (id) => {
    setTodos((current) => {
      const todo = current.find((item) => item.id === id);
      if (!todo) return current;

      const nextStage = todo.completed
        ? todo.stage === "done"
          ? "todo"
          : todo.stage
        : "done";

      return relocateTodo(current, id, nextStage);
    });
  };

  const deleteTodo = (id) => {