function useNavigationHandlers({ inputRef, setShowComposer, setFilter, setDueFilter, setProjectFilter }) {
  const openComposer = () => {
    setShowComposer(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const closeComposer = () => setShowComposer(false);

  const handleNavSelect = (target) => {
    setShowComposer(false);
    if (target === "all") {
      setFilter("all");
      setDueFilter("any");
      setProjectFilter("all");
      return;
    }
    if (target === "completed") {
      setFilter("completed");
      setDueFilter("any");
      return;
    }
    setFilter("all");
    setDueFilter(target);