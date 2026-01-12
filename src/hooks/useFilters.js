import { useState } from "react";

const defaultState = {
  filter: "all",
  search: "",
  projectFilter: "all",
  tagFilter: "all",
  priorityFilter: "all",
  dueFilter: "any",
};

function useFilters(initial = {}) {
  const [state, setState] = useState({ ...defaultState, ...initial });

  const setFilter = (value) => setState((prev) => ({ ...prev, filter: value }));
  const setSearch = (value) => setState((prev) => ({ ...prev, search: value }));
  const setProjectFilter = (value) =>
    setState((prev) => ({ ...prev, projectFilter: value }));
  const setTagFilter = (value) =>