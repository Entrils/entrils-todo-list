import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./HeaderBar.module.css";

function HeaderBar({
  title,
  subtitle,
  search,
  onSearchChange,
  onAdd,
  searchInputRef,
  themeLabel,
  onThemeToggle,
}) {
  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-anim='header-meta'] > *",
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.34,
          ease: "power2.out",
          stagger: 0.06,
        }
      );

      gsap.fromTo(
        "[data-anim='header-actions'] > *",
        { autoAlpha: 0, y: 12 },
        {