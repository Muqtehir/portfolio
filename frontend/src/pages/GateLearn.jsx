import { motion } from "framer-motion";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";

export default function GateLearn({ onBack }) {
  return (
    <GateOpening color="teal">
      <motion.div
        className="gate-page teal gate-learn"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="gate-page-content">
          <button onClick={onBack} className="back-btn">
            ← BACK
          </button>

          <motion.h1
            className="learn-title"
            initial={{ y: -40, opacity: 0, letterSpacing: 6 }}
            animate={{ y: 0, opacity: 1, letterSpacing: 2 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            FUTURE LAB
          </motion.h1>

          <motion.div
            className="coming-soon"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          >
            <div className="glow-ring" />

            <motion.div
              className="cs-content"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <h2>Coming Soon</h2>
              <p>
                A game-inspired learning experience is being built here —
                interactive challenges, achievement systems, and guided pathways
                for becoming a modern developer.
              </p>
              <div className="cs-hints">
                <span>• Skill Quests</span>
                <span>• Interactive Tutorials</span>
                <span>• Live Challenges</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            className="learn-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Stay tuned — this portal will open soon.
          </motion.p>
        </div>
      </motion.div>
    </GateOpening>
  );
}
