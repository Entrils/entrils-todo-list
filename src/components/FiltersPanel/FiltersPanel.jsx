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
        element.removeEventListener("focus", onFocus);
        element.removeEventListener("blur", onBlur);
      });
      ctx.revert();
    };
  }, [tags.length]);

  return (
    <section ref={panelRef} className={styles.panel}>
      <div data-anim="filter-header" className={styles.header}>
        <h2 className={styles.title}>Фильтры доски</h2>
        <p className={styles.subtitle}>Сфокусируйтесь на нужных задачах</p>
      </div>

      <div className={styles.filters}>
        <label data-anim="filter-field" className={styles.label}>
          Тег
          <select
            className={styles.select}
            value={tagFilter}
            onChange={(event) => onTagChange(event.target.value)}
          >
            <option value="all">Все</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label data-anim="filter-field" className={styles.label}>
          Приоритет
          <select
            className={styles.select}
            value={priorityFilter}
            onChange={(event) => onPriorityChange(event.target.value)}
          >
            <option value="all">Любой</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </label>

        <label data-anim="filter-field" className={styles.label}>
          Дедлайн
          <select
            className={styles.select}
            value={dueFilter}
            onChange={(event) => onDueChange(event.target.value)}
          >
            <option value="any">Любой</option>
            <option value="today">Сегодня</option>
            <option value="overdue">Просрочено</option>
            <option value="upcoming">Будущее</option>
            <option value="none">Без даты</option>
          </select>
        </label>
      </div>
    </section>
  );
}

export default FiltersPanel;
