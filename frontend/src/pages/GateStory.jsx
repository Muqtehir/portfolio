import { motion } from "framer-motion";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";

export default function GateStory({ onBack }) {
  return (
    <GateOpening color="purple">
      <motion.div
        className="gate-page purple"
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
            MY STORY
          </motion.h1>

          <motion.div
            className="story-text"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>
              I'm Muqtehir, a passionate software developer on a journey to
              master the craft of building amazing digital experiences.
            </p>
            <p>
              What started as a dream has evolved into a mission to create
              innovative solutions that solve real problems.
            </p>
            <p>
              Every line of code I write brings me closer to becoming the
              developer I aspire to be.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </GateOpening>
  );
}
