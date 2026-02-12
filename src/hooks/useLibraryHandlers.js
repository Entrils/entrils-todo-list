function useLibraryHandlers({
  todos,
  projects,
  tags,
  theme,
  makeExportPayload,
  importData,
  importRef,
  nodeRefs,
}) {
  const handleExport = () => {
    const payload = makeExportPayload({ todos, projects, tags, theme });
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "entrils-todos.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const ok = await importData(file);
    if (!ok) alert("Не удалось прочитать файл.");
    event.target.value = "";
  };

  const getNodeRef = (id) => {
    if (!nodeRefs.current.has(id)) {
      nodeRefs.current.set(id, { current: null });
    }
    return nodeRefs.current.get(id);
  };

  const openImportPicker = () => importRef.current?.click();

  return {
    handleExport,
    handleImport,
    getNodeRef,
    openImportPicker,
  };
}

export { useLibraryHandlers };
