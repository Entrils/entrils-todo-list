import { useEffect, useState } from "react";
import usePersistentState from "../hooks/usePersistentState.js";

function useTheme({ themes, defaultTheme = "linen" }) {
  const [theme, setTheme] = usePersistentState("theme", defaultTheme);
  const [activeTheme, setActiveTheme] = useState(
    themes.find((item) => item.id === theme) || themes[0]
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    setActiveTheme(themes.find((item) => item.id === theme) || themes[0]);
  }, [theme, themes]);

  const handleThemeNext = () => {
    const index = themes.findIndex((item) => item.id === theme);
    const next = themes[(index + 1) % themes.length];
    setTheme(next.id);
  };

  return {
    theme,
    setTheme,
    activeTheme,
    handleThemeNext,
  };
}

export default useTheme;
