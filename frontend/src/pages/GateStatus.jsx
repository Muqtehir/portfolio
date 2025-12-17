import { motion } from "framer-motion";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";

export default function GateStatus({ onBack }) {
  return (
    <GateOpening color="red">
      <motion.div
        className="gate-page red"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="gate-page-content">
          <button onClick={onBack} className="back-btn">
            ← BACK
          </button>

          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            CURRENT STATUS
          </motion.h1>

          <motion.div
            className="status-content"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="status-item">
              <h3>📚 Learning</h3>
              <p>Advanced React patterns, Web3, and System Design</p>
            </div>

            <div className="status-item">
              <h3>🚀 Building</h3>
              <p>Full-stack projects that solve real problems</p>
            </div>

            <div className="status-item">
              <h3>🎯 Goal</h3>
              <p>Become a proficient full-stack developer and create impact</p>
            </div>

            <div className="status-item">
              <h3>💼 Open To</h3>
              <p>Opportunities, collaborations, and challenges</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </GateOpening>
  );
}
