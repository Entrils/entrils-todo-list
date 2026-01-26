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