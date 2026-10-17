import { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export default function MagneticAction({ as = "a", children, className = "", ...props }) {
  const reduceMotion = useReducedMotion();
  const hasGlassPrimaryStyle = className.split(/\s+/).includes("button-dark");
  const [ripple, setRipple] = useState(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const Tag = as === "button" ? motion.button : motion.a;

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.12);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.12);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handlePointerDown = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setRipple({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      id: Date.now(),
    });
    window.setTimeout(() => setRipple(null), 620);
  };

  return (
    <Tag
      {...props}
      className={`magnetic-action ${className}`}
      style={{ ...(props.style || {}), ...(reduceMotion ? {} : { x, y }) }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      whileHover={reduceMotion ? undefined : { scale: 1.025 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
    >
      {hasGlassPrimaryStyle
        ? <span className="magnetic-action-content">{children}</span>
        : children}
      {ripple && (
        <span className="button-ripple-clip" aria-hidden="true">
          <span
            key={ripple.id}
            className="button-ripple"
            style={{ left: ripple.x, top: ripple.y }}
          />
        </span>
      )}
    </Tag>
  );
}
