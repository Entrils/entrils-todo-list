function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "🌙 Тёмная" : "☀️ Светлая"}
    </button>
  );
}

export default ThemeToggle;