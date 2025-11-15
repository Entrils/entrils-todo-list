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
          autoAlpha: 1,
          y: 0,
          duration: 0.34,
          ease: "power2.out",
          stagger: 0.07,
          delay: 0.08,
        }
      );
    }, headerRef);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return () => {
        ctx.revert();
      };
    }

    const magneticButtons = headerRef.current.querySelectorAll("[data-magnetic='true']");
    const listeners = [];

    magneticButtons.forEach((button) => {
      const onMove = (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
          x: gsap.utils.clamp(-7, 7, x * 0.24),
          y: gsap.utils.clamp(-5, 5, y * 0.24),
          scale: 1.02,
          duration: 0.18,
          ease: "power2.out",
        });
      };

      const onLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.22,
          ease: "power2.out",
        });
      };

      button.addEventListener("pointermove", onMove);
      button.addEventListener("pointerleave", onLeave);
      listeners.push([button, onMove, onLeave]);
    });

    return () => {
      listeners.forEach(([button, onMove, onLeave]) => {
        button.removeEventListener("pointermove", onMove);
        button.removeEventListener("pointerleave", onLeave);
      });
      ctx.revert();
    };
  }, [title, subtitle]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div data-anim="header-meta" className={styles.meta}>
        <p className={styles.kicker}>Entrils To do list</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div data-anim="header-actions" className={styles.actions}>
        <label className={styles.searchWrap}>
          <span className={styles.searchLabel}>Поиск</span>
          <input
            ref={searchInputRef}
            className={styles.search}
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Задача, проект, тег (/)"
          />
        </label>

        <div className={styles.tools}>
          <button
            data-magnetic="true"
            type="button"
            className={styles.button}
            onClick={onThemeToggle}
          >
            Тема: {themeLabel}
          </button>
          <button
            data-magnetic="true"
            type="button"
            className={styles.primaryButton}
            onClick={onAdd}
            title="N"
          >
            + Новая задача
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderBar;
