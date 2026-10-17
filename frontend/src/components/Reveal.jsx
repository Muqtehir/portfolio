import { createElement } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({
  children,
  className,
  delay = 0,
  hoverY = 0,
  introStarted = true,
  whileInView = { opacity: 1, y: 0 },
  ...props
}) {
  const reduceMotion = useReducedMotion();

  return createElement(
    motion.div,
    {
      className,
      initial: reduceMotion ? false : { opacity: 0, y: 18 },
      whileHover: hoverY && !reduceMotion ? { y: -hoverY } : undefined,
      viewport: { once: true, amount: 0.15 },
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : delay,
        ease: "easeOut",
      },
      ...props,
      whileInView: introStarted ? whileInView : undefined,
    },
    children,
  );
}
