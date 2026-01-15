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