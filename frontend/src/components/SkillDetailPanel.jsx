import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { createPortal } from "react-dom";
import { skillPanelCopy } from "../data/portfolio";
import { categoryIcons, skillIcons } from "../data/skillIcons";
import { LuCode } from "react-icons/lu";
import LiquidGlass from "./LiquidGlass";

const MotionButton = motion.button;
const MotionDiv = motion.div;
const MotionSpan = motion.span;

function SkillLogo({ skill }) {
  const Icon = skillIcons[skill.iconKey];

  if (!Icon) {
    return <span className="skill-logo-monogram">{skill.symbol}</span>;
  }

  return (
    <Icon
      className={`skill-logo${skill.brandColor === "#ffffff" ? " is-neutral" : ""}`}
      style={{ "--skill-brand-color": skill.brandColor || "var(--category-color)" }}
    />
  );
}

function SkillLens({ skill, launchSkillId, ambientActive, reduceMotion, onLaunchComplete }) {
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const CategoryIcon = categoryIcons[skill.category];
  const shouldShowLaunch = launchSkillId === skill.id && !reduceMotion;

  useEffect(() => {
    if (launchSkillId !== skill.id) return undefined;
    if (reduceMotion) {
      onLaunchComplete();
      return undefined;
    }
    const timeout = window.setTimeout(onLaunchComplete, 500);
    return () => window.clearTimeout(timeout);
  }, [launchSkillId, onLaunchComplete, reduceMotion, skill.id]);

  const handlePointerMove = (event) => {
    if (
      reduceMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    rotateX.set((0.5 - py) * 24);
    rotateY.set((px - 0.5) * 24);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="skill-lens-wrap">
      <MotionDiv
        className="skill-lens"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformPerspective: 800, transformStyle: "preserve-3d" }
        }
      >
        <MotionSpan
          className="skill-lens-glow"
          aria-hidden="true"
          animate={
            ambientActive
              ? { opacity: [0.36, 0.72, 0.36], scale: [0.9, 1.04, 0.9] }
              : { opacity: 0.45, scale: 1 }
          }
          transition={
            ambientActive
              ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        />
        <MotionDiv
          className="skill-lens-ring"
          aria-hidden="true"
          animate={ambientActive ? { rotate: 360 } : { rotate: 0 }}
          transition={
            ambientActive
              ? { duration: 28, repeat: Infinity, ease: "linear" }
              : { duration: 0.2 }
          }
        />
        <AnimatePresence mode="wait" initial={false}>
          <MotionSpan
            key={skill.id}
            className="skill-lens-logo"
            aria-hidden="true"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotateY: -90, scale: 0.6 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, rotateY: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotateY: 90, scale: 0.8 }}
            transition={
              reduceMotion
                ? { duration: 0.18 }
                : {
                    type: "spring",
                    stiffness: 190,
                    damping: 13,
                    delay: shouldShowLaunch ? 0.22 : 0,
                  }
            }
            style={{ transformStyle: "preserve-3d" }}
          >
            {!reduceMotion && (
              <>
                <MotionSpan
                  className="skill-lens-shockwave"
                  initial={{ opacity: 0.85, scale: 0.55 }}
                  animate={{ opacity: 0, scale: 1.65 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  aria-hidden="true"
                />
                {Array.from({ length: 8 }, (_, index) => {
                  const angle = (Math.PI * 2 * index) / 8;
                  return (
                    <MotionSpan
                      key={index}
                      className="skill-lens-spark"
                      initial={{ opacity: 0.95, x: 0, y: 0, scale: 1 }}
                      animate={{
                        opacity: 0,
                        x: Math.cos(angle) * 54,
                        y: Math.sin(angle) * 54,
                        scale: 0.2,
                      }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                      aria-hidden="true"
                    />
                  );
                })}
              </>
            )}
            <MotionSpan
              className="skill-lens-logo-float"
              animate={ambientActive ? { y: [-3, 3, -3] } : { y: 0 }}
              transition={
                ambientActive
                  ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            >
              <SkillLogo skill={skill} />
            </MotionSpan>
          </MotionSpan>
        </AnimatePresence>
        {shouldShowLaunch && (
          <MotionSpan
            className="skill-launch-token"
            layoutId={`skill-symbol-${skill.id}`}
            aria-hidden="true"
          >
            {skill.symbol}
          </MotionSpan>
        )}
      </MotionDiv>
      <span className="skill-lens-category-mark" aria-hidden="true">
        <CategoryIcon />
      </span>
    </div>
  );
}

export default function SkillDetailPanel({
  skill,
  skills,
  hiddenByFilter,
  isMobile,
  isOpen,
  launchSkillId,
  onLaunchComplete,
  onClose,
  onNavigate,
  focusReturnRef,
}) {
  const panelRef = useRef(null);
  const touchStartY = useRef(null);
  const isInView = useInView(panelRef, { margin: "-8% 0px -8% 0px" });
  const reduceMotion = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );
  const skillIndex = skill ? skills.findIndex((item) => item.id === skill.id) : -1;
  const ambientActive = Boolean(isInView && pageVisible && !reduceMotion);
  const SelectedCategoryIcon = skill ? categoryIcons[skill.category] : null;

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPageVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isMobile || !isOpen) return undefined;

    const panel = panelRef.current;
    const pageRoot = document.getElementById("root");
    const previousFocus = focusReturnRef.current || document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    const hadInert = pageRoot?.hasAttribute("inert") ?? false;
    const previousAriaHidden = pageRoot?.getAttribute("aria-hidden");

    const getFocusableElements = () => Array.from(
      panel?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => element.getClientRects().length > 0);

    const initialFocus = panel?.querySelector(".skill-panel-close") || panel;
    initialFocus?.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";
    pageRoot?.setAttribute("inert", "");
    pageRoot?.setAttribute("aria-hidden", "true");

    const containFocus = (event) => {
      if (event.key !== "Tab") return;
      const focusableElements = getFocusableElements();
      const first = focusableElements[0];
      const last = focusableElements.at(-1);

      if (!first || !last) {
        event.preventDefault();
        panel?.focus({ preventScroll: true });
      } else if (event.shiftKey && (document.activeElement === first || !panel?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", containFocus, true);

    return () => {
      document.removeEventListener("keydown", containFocus, true);
      document.documentElement.style.overflow = previousOverflow;
      if (pageRoot) {
        if (!hadInert) pageRoot.removeAttribute("inert");
        if (previousAriaHidden === null) {
          pageRoot.removeAttribute("aria-hidden");
        } else {
          pageRoot.setAttribute("aria-hidden", previousAriaHidden);
        }
      }
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
      focusReturnRef.current = null;
    };
  }, [focusReturnRef, isMobile, isOpen]);

  const handleTouchStart = (event) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event) => {
    const startY = touchStartY.current;
    const endY = event.changedTouches[0]?.clientY;
    if (isMobile && startY !== null && endY - startY > 70) onClose();
    touchStartY.current = null;
  };

  const goTo = (offset) => {
    const nextIndex = (skillIndex + offset + skills.length) % skills.length;
    onNavigate(skills[nextIndex]);
  };

  const panelContent = (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <MotionButton
            type="button"
            className="skill-sheet-backdrop"
            aria-label={skillPanelCopy.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
      </AnimatePresence>
      <LiquidGlass
        ref={panelRef}
        as="aside"
        variant="panel"
        className={`skill-panel${isMobile && isOpen ? " is-open" : ""}${skill ? ` category-${skill.category.toLowerCase()}` : ""}`}
        role={isMobile && isOpen ? "dialog" : "region"}
        aria-modal={isMobile && isOpen ? true : undefined}
        aria-label={skill ? `${skill.name} ${skillPanelCopy.panelLabel}` : skillPanelCopy.panelLabel}
        aria-live={isMobile ? undefined : "polite"}
        tabIndex={isMobile && isOpen ? -1 : undefined}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        initial={false}
        animate={
          isMobile
            ? {
                y: reduceMotion || isOpen ? 0 : "105%",
                opacity: isOpen ? 1 : 0,
              }
            : { y: 0, opacity: 1 }
        }
        transition={
          reduceMotion
            ? { duration: 0.16 }
            : { type: "spring", stiffness: 320, damping: 32 }
        }
      >
        {isMobile && (
          <div className="skill-panel-mobile-header">
            <span className="skill-sheet-handle" aria-hidden="true" />
            <button
              type="button"
              className="skill-panel-close"
              aria-label={skillPanelCopy.close}
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        )}
        {skill ? (
          <>
            <span className="sr-only">
              {skillPanelCopy.selected} {skill.name}, {skill.category}
            </span>
            {hiddenByFilter && (
              <p className="skill-hidden-note">{skillPanelCopy.hiddenByFilter}</p>
            )}
            <SkillLens
              skill={skill}
              launchSkillId={launchSkillId}
              ambientActive={ambientActive}
              reduceMotion={reduceMotion}
              onLaunchComplete={onLaunchComplete}
            />
            <AnimatePresence mode="wait" initial={false}>
              <MotionDiv
                key={skill.id}
                className="skill-panel-copy"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: reduceMotion ? 0.16 : 0.22 }}
              >
                <h3>{skill.name}</h3>
                <div className="skill-panel-chips">
                  <span className="skill-category-chip">
                    <SelectedCategoryIcon aria-hidden="true" />
                    {skill.category}
                  </span>
                  {skill.status === "learning" && (
                    <span className="skill-status-chip">
                      <span className="skill-status-dot" aria-hidden="true" />
                      {skillPanelCopy.learning}
                    </span>
                  )}
                </div>
                <p className="skill-blurb">{skill.blurb}</p>
                {skill.usedIn.length > 0 && (
                  <div className="skill-used-in">
                    <h4>{skillPanelCopy.usedIn}</h4>
                    <ul>
                      {skill.usedIn.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </MotionDiv>
            </AnimatePresence>
            <nav className="skill-panel-navigation" aria-label={skillPanelCopy.panelLabel}>
              <button type="button" onClick={() => goTo(-1)}>
                <span aria-hidden="true">‹</span>
                {skillPanelCopy.previous}
              </button>
              <span className="skill-panel-position">
                {String(skillIndex + 1).padStart(2, "0")} / {String(skills.length).padStart(2, "0")}
              </span>
              <button type="button" onClick={() => goTo(1)}>
                {skillPanelCopy.next}
                <span aria-hidden="true">›</span>
              </button>
            </nav>
          </>
        ) : (
          <div className="skill-panel-empty">
            <MotionDiv
              className="skill-empty-grid"
              aria-hidden="true"
              animate={ambientActive ? { y: [0, -5, 0] } : { y: 0 }}
              transition={
                ambientActive
                  ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            />
            <MotionSpan
              className="skill-empty-tile"
              aria-hidden="true"
              animate={
                ambientActive
                  ? { opacity: [0.55, 0.95, 0.55], scale: [1, 1.045, 1] }
                  : { opacity: 0.7, scale: 1 }
              }
              transition={
                ambientActive
                  ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            >
              <LuCode aria-hidden="true" />
            </MotionSpan>
            <p>{skillPanelCopy.emptyHint}</p>
          </div>
        )}
      </LiquidGlass>
    </>
  );

  return isMobile ? createPortal(panelContent, document.body) : panelContent;
}
