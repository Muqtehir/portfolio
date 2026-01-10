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
            transition={{ delay: 0.45 }}
          >
            CURRENT STATUS
          </motion.h1>

          <motion.div
            className="status-content"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <div className="status-item" style={{ textAlign: "left" }}>
              <div className="story-text">
                <p className="lead">
                  I am currently a 16-year-old SS3 student who is actively
                  learning and building in web development. At this stage, my
                  focus is not on being perfect, but on understanding how things
                  actually work and improving step by step.
                </p>

                <p>
                  Right now, I am working as a full-stack beginner, building
                  real projects with both frontend and backend. I am
                  strengthening my foundation in JavaScript and React while also
                  improving how I structure backend logic using Node.js,
                  Express, and MongoDB.
                </p>

                <p>I am especially focused on:</p>

                <div className="story-journey">
                  <div className="journey-items">
                    <div className="journey-pill">
                      <strong>Writing cleaner code</strong>
                      <span>Readable, structured, and maintainable</span>
                    </div>
                    <div className="journey-pill">
                      <strong>Improving UX</strong>
                      <span>Polish interactions and flow</span>
                    </div>
                    <div className="journey-pill">
                      <strong>Frontend ↔ Backend</strong>
                      <span>Understanding communication patterns</span>
                    </div>
                    <div className="journey-pill">
                      <strong>Debugging</strong>
                      <span>Fix, learn, and iterate independently</span>
                    </div>
                  </div>
                </div>

                <p>
                  At the moment, I am still learning and experimenting, but I am
                  consistent. I build, break, fix, and rebuild — and each
                  project helps me grow more confident in my skills.
                </p>

                <p>
                  This portfolio represents my current level, not my final
                  destination. I am still learning, still improving, and still
                  moving forward.
                </p>
              </div>
            </div>

            <motion.div
              className="status-item"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              <h3 style={{ marginBottom: "0.75rem" }}>Current Focus</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Full-stack projects</span>
                  <span className="status in-progress">Unlocked</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>JavaScript & React</span>
                  <span className="status in-progress">Improving</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Node.js / Express / MongoDB</span>
                  <span className="status Learning">Improving</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Code Readability</span>
                  <span className="status unlocked">Unlocked</span>
                </div>
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <button className="back-btn" onClick={onBack}>
                  ← Back to Gates
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </GateOpening>
  );
}
