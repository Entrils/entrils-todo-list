const unique = (items) => Array.from(new Set(items));

const normalizeTags = (raw) => {
  if (!raw) return [];
  const parts = raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  return Array.from(new Set(parts));
};

const normalizeImportedTodos = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => ({
    id: item.id ?? Date.now() + index,
    text: String(item.text || "").trim() || "Задача",
    completed: Boolean(item.completed),
    createdAt: item.createdAt || new Date().toISOString(),
    project: item.project || "Inbox",
    tags: Array.isArray(item.tags) ? item.tags : [],
    priority: item.priority || "medium",
    dueDate: item.dueDate || "",
  }));
};

const makeExportPayload = ({ todos, projects, tags, theme }) => ({
  version: 1,
  todos,
  projects,
  tags,
  theme,
});

const parseImportPayload = (data, themes, fallbackTheme) => {
  if (!data || typeof data !== "object") return null;

  const importedTodos = normalizeImportedTodos(data.todos || []);
  const importedProjects = unique(["Inbox", ...(data.projects || [])]);
  const importedTags = unique(data.tags || []);
  const importedTheme = themes.some((item) => item.id === data.theme)
    ? data.theme
    : fallbackTheme;

  return {
    todos: importedTodos,
    projects: importedProjects,
    tags: importedTags,
    theme: importedTheme,
  };
};

export {
  unique,
  normalizeTags,
  normalizeImportedTodos,
  makeExportPayload,
  parseImportPayload,
};
