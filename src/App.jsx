import { useRef, useState } from "react";
import { useLibraryHandlers } from "./hooks/useLibraryHandlers.js";
import { useNavigationHandlers } from "./hooks/useNavigationHandlers.js";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import HeaderBar from "./components/HeaderBar/HeaderBar.jsx";
import FiltersPanel from "./components/FiltersPanel/FiltersPanel.jsx";
import LibraryOverlay from "./components/LibraryOverlay/LibraryOverlay.jsx";
import TodoForm from "./components/TodoForm/TodoForm.jsx";
import TodoListView from "./components/TodoListView/TodoListView.jsx";
import useTodos from "./hooks/useTodos.js";
import useLibraryState from "./hooks/useLibraryState.js";
import useTheme from "./hooks/useTheme.js";
import useFilters from "./hooks/useFilters.js";
import { makeExportPayload } from "./utils/todoData.js";
import { THEMES, PROJECT_COLORS } from "./config.js";
import styles from "./App.module.css";

function App() {
  const inputRef = useRef(null);

  const {
    filter,
    search,
    projectFilter,
    tagFilter,
    priorityFilter,
    dueFilter,
    setFilter,
    setSearch,
    setProjectFilter,
    setTagFilter,
    setPriorityFilter,
    setDueFilter,
  } = useFilters();

  const [dragFocus, setDragFocus] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const { theme, setTheme, activeTheme, handleThemeNext } = useTheme({
    themes: THEMES,
    defaultTheme: "linen",
  });

  const {
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
  } = useLibraryState({ themes: THEMES, theme, setTheme });

  const { filteredTodos, titleLabel, navActive, projectActive } = useTodos({
    todos,
    filter,
    projectFilter,
    tagFilter,
    priorityFilter,
    dueFilter,
    search,
    showComposer,
  });

  const { handleExport, handleImport, getNodeRef, openImportPicker } =
    useLibraryHandlers({
      todos,
      projects,
      tags,
      theme,
      makeExportPayload,
      importData,
      importRef,
      nodeRefs,
    });

  const {
    openComposer,
    closeComposer,
    handleNavSelect,
    handleProjectSelect,
    handleProjectReset,
  } = useNavigationHandlers({
    inputRef,
    setShowComposer,
    setFilter,
    setDueFilter,
    setProjectFilter,
  });

  return (
    <div className={styles.shell}>
      <Sidebar
        search={search}
        onSearchChange={setSearch}
        onAdd={openComposer}
        navActive={navActive}
        onNavSelect={handleNavSelect}
        projects={projects}
        projectActive={projectActive}
        onProjectSelect={handleProjectSelect}
        onProjectReset={handleProjectReset}
        menuActive={showLibrary}
        onMenuToggle={() => setShowLibrary((current) => !current)}
        onThemeToggle={handleThemeNext}
        themeLabel={activeTheme.label}
        projectColors={PROJECT_COLORS}
      />

      <main
        className={`${styles.app} ${dragFocus ? styles.dragFocus : ""}`}
        onDragEnter={() => {
          setDragFocus(true);
          inputRef.current?.focus();
        }}
        onDragLeave={() => setDragFocus(false)}
        onDrop={() => setDragFocus(false)}
      >
        <HeaderBar
          title={showComposer ? "Добавить новую задачу" : titleLabel}
          subtitle="Все задачи в одном месте."
        />

        {showComposer ? (
          <div className={styles.composer}>
            <div className={styles.composerTitle}>Новая задача</div>
            <TodoForm
              addTodo={(text, meta) => {
                const ok = addTodo(text, meta);
                if (ok) setShowComposer(false);
              }}
              projects={projects}
              tags={tags}
              inputRef={inputRef}
              defaultProject={projectFilter !== "all" ? projectFilter : "Inbox"}
              onCancel={closeComposer}
            />
          </div>
        ) : null}

        {!showComposer ? (
          <FiltersPanel
            tagFilter={tagFilter}
            tags={tags}
            onTagChange={setTagFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            dueFilter={dueFilter}
            onDueChange={setDueFilter}
          />
        ) : null}

        {!showComposer ? (
          filteredTodos.length === 0 ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>Задач нет</h3>
              <p>Добавьте задачу или снимите фильтры.</p>
            </div>
          ) : (
            <TodoListView
              todos={filteredTodos}
              getNodeRef={getNodeRef}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          )
        ) : null}
      </main>

      <LibraryOverlay
        open={showLibrary}
        onClose={() => setShowLibrary(false)}
        projects={projects}
        tags={tags}
        newProject={newProject}
        newTag={newTag}
        onProjectChange={setNewProject}
        onTagChange={setNewTag}
        onProjectAdd={addProject}
        onTagAdd={addTag}
        onProjectRemove={removeProject}
        onTagRemove={removeTag}
        onExport={handleExport}
        onImportPick={openImportPicker}
        onImport={handleImport}
        importRef={importRef}
      />
    </div>
  );
}

export default App;
