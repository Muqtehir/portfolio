import { motion } from "framer-motion";
import "../styles/gates.css";

const gates = [
  { id: "story", label: "STORY", color: "purple" },
  { id: "skills", label: "SKILLS", color: "green" },
  { id: "projects", label: "PROJECTS", color: "blue" },
  { id: "status", label: "CURRENT STATUS", color: "red" },
  { id: "contact", label: "CONTACT", color: "gold" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const gateVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -20 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const hoverVariants = {
  hover: {
    y: -12,
    scale: 1.08,
    boxShadow: "0 30px 60px rgba(255,255,255,0.1)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export default function Gates({ onGateClick }) {
  return (
    <motion.div
      className="gates-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {gates.map((gate, index) => (
        <motion.button
          key={gate.id}
          className={`gate ${gate.color}`}
          variants={gateVariants}
          whileHover={hoverVariants}
          onClick={() => onGateClick(gate.id)}
          type="button"
          style={{
            border: "none",
            background: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          {/* Gate shine effect */}
          <div className="gate-shine" />

          {/* Gate border accent */}
          <div className={`gate-border ${gate.color}`} />

          {/* Icon placeholder */}
          <div className="gate-icon">
            {["👤", "⚙️", "🎯", "📊", "✉️"][index]}
          </div>

          {/* Label */}
          <span className="gate-label">{gate.label}</span>

          {/* Light effect on hover */}
          <div className={`gate-light ${gate.color}`} />
        </motion.button>
      ))}
    </motion.div>
  );
}
