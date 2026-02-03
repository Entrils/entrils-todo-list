const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

function useTodos({
  todos,
  filter,
  projectFilter,
  tagFilter,
  priorityFilter,
  dueFilter,
  search,
  showComposer,
}) {
  const normalizedSearch = search.trim().toLowerCase();
  const today = startOfDay(new Date());

  let filtered = todos.filter((todo) => {
    if (filter === "active" && todo.completed) return false;
    if (filter === "completed" && !todo.completed) return false;

    if (projectFilter !== "all" && todo.project !== projectFilter) return false;

    if (tagFilter !== "all") {
      const hasTag = (todo.tags || []).some(
        (tag) => tag.toLowerCase() === tagFilter.toLowerCase()
      );
      if (!hasTag) return false;
    }

    if (priorityFilter !== "all" && todo.priority !== priorityFilter) return false;

    if (dueFilter !== "any") {