import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./FiltersPanel.module.css";

function FiltersPanel({
  tagFilter,
  tags,
  onTagChange,
  priorityFilter,
  onPriorityChange,
  dueFilter,
  onDueChange,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-anim='filter-header']",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        "[data-anim='filter-field']",
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out",