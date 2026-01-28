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