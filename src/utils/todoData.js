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
