import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./Sidebar.module.css";

const navItems = [
  { id: "all", label: "Все задачи" },
  { id: "today", label: "Сегодня" },
  { id: "upcoming", label: "Предстоящие" },
  { id: "overdue", label: "Просроченные" },
  { id: "completed", label: "Готово" },
];

function Sidebar({
  navActive,
  onNavSelect,
  navStats,
  projects,
  projectActive,
  onProjectSelect,
  onProjectReset,
  projectColors,
}) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!sidebarRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-anim='sidebar-brand']",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" }
      );

      gsap.fromTo(
        "[data-anim='sidebar-section']",
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,