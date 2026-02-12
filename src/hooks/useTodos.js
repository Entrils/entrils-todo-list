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
      if (!todo.dueDate) {
        if (dueFilter !== "none") return false;
      } else {
        const due = startOfDay(new Date(todo.dueDate));
        if (dueFilter === "today" && due.getTime() !== today.getTime()) return false;
        if (dueFilter === "overdue" && due >= today) return false;
        if (dueFilter === "upcoming" && due <= today) return false;
        if (dueFilter === "none") return false;
      }
    }

    if (normalizedSearch) {
      const haystack = [
        todo.text,
        todo.project,
        (todo.tags || []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalizedSearch)) return false;
    }

    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const titleLabel = (() => {
    if (dueFilter === "today") return "Сегодня";
    if (dueFilter === "overdue") return "Просрочено";
    if (filter === "completed") return "Выполненные";
    if (filter === "active") return "Активные";
    return projectFilter !== "all" ? projectFilter : "Список";
  })();

  const navActive = showComposer
    ? null
    : dueFilter === "today"
    ? "today"
    : dueFilter === "upcoming"
    ? "upcoming"
    : dueFilter === "overdue"
    ? "overdue"
    : filter === "completed"
    ? "completed"
    : filter === "all" && dueFilter === "any" && projectFilter === "all"
    ? "all"
    : null;

  const projectActive = showComposer ? null : projectFilter;

  return {
    filteredTodos: filtered,
    titleLabel,
    navActive,
    projectActive,
  };
}

export default useTodos;
