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
          stagger: 0.06,
          delay: 0.06,
        }
      );
    }, panelRef);

    const fields = panelRef.current.querySelectorAll("select");
    const listeners = [];

    fields.forEach((element) => {
      const onFocus = () => {
        gsap.to(element, {
          y: -1,
          duration: 0.14,
          ease: "power2.out",
        });
      };

      const onBlur = () => {
        gsap.to(element, {
          y: 0,
          duration: 0.14,
          ease: "power2.out",
        });
      };

      element.addEventListener("focus", onFocus);
      element.addEventListener("blur", onBlur);
      listeners.push([element, onFocus, onBlur]);
    });

    return () => {
      listeners.forEach(([element, onFocus, onBlur]) => {