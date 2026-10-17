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
                  I build and ship full-stack web experiences that connect
                  thoughtful design with reliable functionality. As a full-stack
                  freelancer, I focus on delivering practical solutions that are
                  clean, user-friendly, and built to work well in real use.
                </p>

                <p>
                  My work spans frontend interfaces and backend systems, using
                  JavaScript, React, Node.js, Express, and MongoDB to create
                  smooth, scalable applications from concept to deployment.
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
                  I approach each project with a focus on quality, structure, and
                  long-term maintainability. I build, refine, and optimize until
                  the product feels solid and professional.
                </p>

                <p>
                  This portfolio reflects the work I create as a full-stack
                  freelancer, with an emphasis on creative execution, problem
                  solving, and dependable delivery.
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
                  <span>Full-stack delivery</span>
                  <span className="status unlocked">Unlocked</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>JavaScript & React</span>
                  <span className="status unlocked">Unlocked</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Node.js / Express / MongoDB</span>
                  <span className="status unlocked">Unlocked</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Code quality</span>
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
