import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { skillPanelCopy } from "../data/portfolio";

const MotionButton = motion.button;

export default function SkillTile({
  skill,
  number,
  index,
  hasSelection,
  active,
  dimmed,
  tileRef,
  onSelect,
  onNavigate,
}) {
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 });
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 });

  const handleMove = (event) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    rotateX.set((0.5 - py) * 14);
    rotateY.set((px - 0.5) * 14);
    x.set((px - 0.5) * 4);
    y.set((py - 0.5) * 4);
    event.currentTarget.style.setProperty("--pointer-x", `${px * 100}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${py * 100}%`);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
  };

  return (
    <MotionButton
      ref={tileRef}
      type="button"
      layout={!reduceMotion}
      className={`element-tile relative flex flex-col items-start justify-between category-${skill.category.toLowerCase()}${skill.status === "learning" ? " is-learning" : ""}${active ? " is-selected" : ""}${dimmed ? " is-dimmed" : ""}`}
      aria-pressed={active}
      aria-label={`${skill.name}, ${skill.category}, ${skill.status === "learning" ? skillPanelCopy.learning : skillPanelCopy.known}`}
      title={`${skill.name} · ${skill.category}`}
      tabIndex={active || (!hasSelection && index === 0) ? 0 : -1}
      onClick={(event) => onSelect(skill, true, event.currentTarget)}
      onMouseEnter={() => {
        if (
          window.matchMedia(
            "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
          ).matches
        ) {
          onSelect(skill, false);
        }
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) onSelect(skill, false);
      }}
      onKeyDown={(event) => onNavigate(event, index)}
      onPointerMove={handleMove}
      onPointerLeave={resetTilt}
      style={reduceMotion ? undefined : { rotateX, rotateY, x, y, transformPerspective: 700 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
    >
      <span className="element-number">{number}</span>
      <motion.span
        className="element-symbol"
        layoutId={reduceMotion ? undefined : `skill-symbol-${skill.id}`}
      >
        {skill.symbol}
      </motion.span>
      <span className="element-name">{skill.name}</span>
      {skill.status === "learning" && (
        <span className="learning-label">{skillPanelCopy.learning}</span>
      )}
    </MotionButton>
  );
}
