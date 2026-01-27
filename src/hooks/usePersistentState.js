import { useEffect, useState } from "react";

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return typeof defaultValue === "function" ? defaultValue() : defaultValue;
    }
    return safeParse(stored, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
