import styles from "./LibraryOverlay.module.css";

function LibraryOverlay({
  open,
  onClose,
  projects,
  tags,
  newProject,
  newTag,
  onProjectChange,
  onTagChange,
  onProjectAdd,
  onTagAdd,
  onProjectRemove,
  onTagRemove,
  onExport,
  onImportPick,
  onImport,
  importRef,
}) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>Проекты и теги</div>
          <button type="button" className={styles.close} onClick={onClose}>
            Закрыть
          </button>
        </div>
        <div className={styles.library}>
          <div className={styles.block}>
            <div className={styles.blockTitle}>Проекты</div>
            <div className={styles.controls}>
              <input
                className={styles.input}
                type="text"
                value={newProject}
                onChange={(e) => onProjectChange(e.target.value)}
                placeholder="Новый проект"
              />
              <button type="button" className={styles.controlButton} onClick={onProjectAdd}>
                Добавить
              </button>
            </div>
            <div className={styles.list}>
              {projects.map((project) => (
                <span key={project} className={styles.chip}>
                  {project}
                  {project !== "Inbox" ? (
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => onProjectRemove(project)}
                    >
                      ×
                    </button>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.blockTitle}>Теги</div>
            <div className={styles.controls}>
              <input
                className={styles.input}
                type="text"
                value={newTag}
                onChange={(e) => onTagChange(e.target.value)}
                placeholder="Новый тег"
              />
              <button type="button" className={styles.controlButton} onClick={onTagAdd}>
                Добавить
              </button>
            </div>
            <div className={styles.list}>
              {tags.length === 0 ? (
                <span className={styles.empty}>Тегов пока нет</span>
              ) : (
                tags.map((tag) => (
                  <span key={tag} className={styles.chip}>
                    #{tag}
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => onTagRemove(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.blockTitle}>Экспорт и импорт</div>
            <div className={styles.controls}>
              <button type="button" className={styles.controlButton} onClick={onExport}>
                Экспорт JSON
              </button>
              <button type="button" className={styles.controlButton} onClick={onImportPick}>
                Импорт JSON
              </button>
              <input
                ref={importRef}
                type="file"
                accept="application/json"
                className={styles.fileInput}
                onChange={onImport}
              />
            </div>
            <div className={styles.hint}>Экспорт текущих данных.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryOverlay;
