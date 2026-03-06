const BOARD_STAGES = ["todo", "in_progress", "done"];

const unique = (items) => Array.from(new Set(items));

const normalizeTags = (raw) => {
  if (!raw) return [];
  const parts = raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  return Array.from(new Set(parts));
};

const normalizeStage = (value, completed = false) => {
  if (BOARD_STAGES.includes(value)) return value;
  return completed ? "done" : "todo";
};

const normalizeImportedTodos = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => {
    const completed = Boolean(item.completed);
    const stage = normalizeStage(item.stage, completed);
    const order = Number.isFinite(item.order) ? item.order : index + 1;

    return {
      id: item.id ?? Date.now() + index,
      text: String(item.text || "").trim() || "Задача",
      completed: stage === "done",
      createdAt: item.createdAt || new Date().toISOString(),
      project: item.project || "Inbox",
      tags: Array.isArray(item.tags) ? item.tags : [],
      priority: item.priority || "medium",
      dueDate: item.dueDate || "",
      stage,
      order,
    };
  });
};

const makeExportPayload = ({ todos, projects, tags, theme }) => ({
  version: 2,
  todos,
  projects,
  tags,
  theme,
});

const parseImportPayload = (data, themes, fallbackTheme) => {
  if (!data || typeof data !== "object") return null;
