import { motion } from "framer-motion";

export default function GateOpening({ children, color }) {
  return (
    <motion.div
      className="gate-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Left Door */}
      <motion.div
        className={`gate-door left ${color}`}
        initial={{ scaleX: 1, x: 0 }}
        animate={{ scaleX: 0, x: "-100%" }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      />

      {/* Right Door */}
      <motion.div
        className={`gate-door right ${color}`}
        initial={{ scaleX: 1, x: 0 }}
        animate={{ scaleX: 0, x: "100%" }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
