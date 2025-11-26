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
          y: 0,
          duration: 0.38,
          ease: "power2.out",
          stagger: 0.08,
          delay: 0.08,
        }
      );

      gsap.fromTo(
        "[data-anim='sidebar-item']",
        { autoAlpha: 0, x: -10 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.02,
          delay: 0.16,
        }
      );
    }, sidebarRef);

    const itemElements = sidebarRef.current.querySelectorAll("[data-anim='sidebar-item']");
    const listeners = [];

    itemElements.forEach((element) => {
      const onEnter = () => {
        gsap.to(element, {
          x: 4,
          duration: 0.16,
          ease: "power2.out",
        });
      };

      const onLeave = () => {
        gsap.to(element, {
          x: 0,
          duration: 0.16,
          ease: "power2.out",
        });
      };

      element.addEventListener("mouseenter", onEnter);
      element.addEventListener("mouseleave", onLeave);
      listeners.push([element, onEnter, onLeave]);
    });

    return () => {
      listeners.forEach(([element, onEnter, onLeave]) => {
        element.removeEventListener("mouseenter", onEnter);
        element.removeEventListener("mouseleave", onLeave);
      });
      ctx.revert();
    };
  }, [projects.length]);

  const itemClass = (active) =>
    active ? `${styles.item} ${styles.itemActive}` : styles.item;

  return (
    <aside ref={sidebarRef} className={styles.sidebar}>
      <div data-anim="sidebar-brand" className={styles.brandBlock}>
        <div className={styles.logo}>ET</div>
        <div>
          <p className={styles.brandTitle}>Entrils To do list</p>
          <p className={styles.brandHint}>Доска задач</p>
        </div>
      </div>

      <div data-anim="sidebar-section" className={styles.section}>
        <div className={styles.title}>Навигация</div>
        <div className={styles.list}>
          {navItems.map((item) => (
            <button
              data-anim="sidebar-item"
              key={item.id}
              className={itemClass(navActive === item.id)}
              onClick={() => onNavSelect(item.id)}
            >
              <span>{item.label}</span>
              <span className={styles.counter}>{navStats[item.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div data-anim="sidebar-section" className={styles.section}>
        <div className={styles.title}>Проекты</div>
        <div className={styles.list}>
          {projects.map((project, index) => (
            <button
              data-anim="sidebar-item"
              key={project}
              className={itemClass(projectActive === project)}
              onClick={() => onProjectSelect(project)}
            >
              <span
                className={styles.dot}
                style={{ background: projectColors[index % projectColors.length] }}
              />
              <span className={styles.projectName}>{project}</span>
            </button>
          ))}
          <button
            data-anim="sidebar-item"
            className={`${styles.item} ${styles.itemGhost}`}
            onClick={onProjectReset}
          >
            Сбросить фильтр
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
