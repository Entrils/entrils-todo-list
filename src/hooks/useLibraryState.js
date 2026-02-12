import { useEffect, useRef, useState } from "react";
import usePersistentState from "../hooks/usePersistentState.js";
import { unique, normalizeTags, parseImportPayload } from "../utils/todoData.js";

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
    setProjects(projects.filter((item) => item !== project));
    setTodos(
      todos.map((todo) =>
        todo.project === project ? { ...todo, project: "Inbox" } : todo
      )
    );
  };

  const removeTag = (tag) => {
    setTags(tags.filter((item) => item !== tag));
    setTodos(
      todos.map((todo) => ({
        ...todo,
        tags: (todo.tags || []).filter((item) => item !== tag),
      }))
    );
  };

  const addTodo = (text, meta) => {
    const trimmed = text.trim();
    if (trimmed === "") return false;

    const project = (meta.project || "").trim() || "Inbox";
    const todoTags = normalizeTags(meta.tags);

    if (!projects.includes(project)) {
      setProjects([...projects, project]);
    }

    const nextTags = unique([...tags, ...todoTags]);
    if (nextTags.length !== tags.length) {
      setTags(nextTags);
    }

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: trimmed,
        completed: false,
        createdAt: new Date().toISOString(),
        project,
        tags: todoTags,
        priority: meta.priority || "medium",
        dueDate: meta.dueDate || "",
      },
    ]);

    return true;
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    const trimmed = newText.trim();
    if (trimmed === "") return;
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    );
  };

  const importData = async (file) => {
    if (!file) return false;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const payload = parseImportPayload(parsed, themes, theme);
      if (!payload) return false;

      setTodos(payload.todos);
      setProjects(payload.projects);
      setTags(payload.tags);
      setTheme(payload.theme);
      return true;
    } catch {
      return false;
    }
  };

  return {
    nodeRefs,
    importRef,
    todos,
    projects,
    tags,
    newProject,
    setNewProject,
    newTag,
    setNewTag,
    addProject,
    addTag,
    removeProject,
    removeTag,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    importData,
  };
}

export default useLibraryState;
