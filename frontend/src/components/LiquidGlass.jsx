import { motion, useReducedMotion } from "framer-motion";

const motionElements = {
  a: motion.a,
  article: motion.article,
  aside: motion.aside,
  button: motion.button,
  div: motion.div,
  footer: motion.footer,
  header: motion.header,
  li: motion.li,
  nav: motion.nav,
  section: motion.section,
  span: motion.span,
};

export default function LiquidGlass({
  as = "div",
  variant = "panel",
  interactive = false,
  className = "",
  children,
  transition,
  onPointerMove,
  onPointerLeave,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const MotionElement = motionElements[as] || motion.div;
  const isInteractive = interactive && !reduceMotion;

  const handlePointerMove = (event) => {
    if (isInteractive && event.pointerType !== "touch") {
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      event.currentTarget.style.setProperty("--glass-pointer-x", `${x}%`);
      event.currentTarget.style.setProperty("--glass-pointer-y", `${y}%`);
    }
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty("--glass-pointer-x", "50%");
    event.currentTarget.style.setProperty("--glass-pointer-y", "50%");
    onPointerLeave?.(event);
  };

  return (
    <MotionElement
      {...props}
      className={`liquid-glass liquid-glass--${variant}${interactive ? " is-interactive" : ""}${className ? ` ${className}` : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={isInteractive ? { scale: 1.025 } : undefined}
      whileTap={isInteractive ? { scale: 0.97 } : undefined}
      transition={transition || (isInteractive ? { type: "spring", stiffness: 340, damping: 24 } : undefined)}
    >
      {children}
    </MotionElement>
  );
}
