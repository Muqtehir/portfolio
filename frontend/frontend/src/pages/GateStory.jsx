import { motion } from "framer-motion";
import { useState } from "react";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";

export default function GateStory({ onBack }) {
  const [expanded, setExpanded] = useState(false);
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="lead"
            >
              My name is <strong>Mayaleeke Muqtehir</strong>, though I'm also
              known as <strong>Amir</strong>. My journey into technology began
              with curiosity — a desire to understand how the things behind the
              screen actually worked.
              <br />
              <br />
              What started as an interest in <strong>software development</strong>
              has grown into a broader journey through <strong>full-stack
              development, cybersecurity, and blockchain technology</strong>.
              Along the way, I've worked with technologies such as{" "}
              <strong>React, Node.js, Express, MongoDB, Git, and modern web
              development tools</strong>, while continuing to strengthen my
              foundations and explore new areas of technology.
              <br />
              <br />
              I'm now focused on taking the next step in my journey —
              building real-world projects, developing my skills in
              <strong>cybersecurity and blockchain</strong>, and gradually
              turning what I learn into practical solutions.
              <br />
              <br />
              This portfolio is a reflection of that journey: <strong>where I
              started, what I've built, what I'm learning now, and where I'm
              going next.</strong>
            </motion.p>

            <motion.div className="story-excerpt">
              <motion.p
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                At the beginning, I was unsure of where to start. There were
                many paths, many technologies, and many opinions. What I did
                have, however, was the willingness to learn and to keep going
                even when things did not make sense at first.
              </motion.p>

              {expanded && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <p>
                    I started with the basics —{" "}
                    <strong>HTML, CSS, and JavaScript</strong> — making
                    mistakes, fixing them, and slowly understanding how the web
                    works.
                  </p>

                  <p>
                    As time went on, web development became more than just
                    writing code. I began to care deeply about{" "}
                    <span className="accent">user experience</span>,
                    interaction, and design. I learned that a good website is
                    not only functional, but also intentional — every movement,
                    color, and transition matters.
                  </p>

                  <p>
                    Eventually, I stepped into <strong>full-stack</strong>
                    development. I learned how to connect the frontend to the
                    backend, how data is stored, and how real applications are
                    structured. Building projects taught me patience,
                    problem-solving, and the importance of writing code that
                    actually works, not just code that looks good.
                  </p>

                  <p>
                    This portfolio represents my journey so far. It is not a
                    declaration of mastery, but a reflection of growth. I am
                    still learning, still building, and still improving with
                    every project. This is only a checkpoint — and the journey
                    continues.
                  </p>
                </motion.div>
              )}

              <motion.button
                className="read-toggle"
                onClick={() => setExpanded((s) => !s)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {expanded ? "Show Less" : "Read More"}
              </motion.button>
            </motion.div>

            <motion.div
              className="story-journey"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <h4>Journey Highlights</h4>
              <div className="journey-items">
                <motion.div
                  className="journey-pill"
                  whileHover={{ scale: 1.05 }}
                >
                  <strong>Basics</strong>
                  <span>HTML • CSS • JS</span>
                </motion.div>

                <motion.div
                  className="journey-pill"
                  whileHover={{ scale: 1.05 }}
                >
                  <strong>UX & Animation</strong>
                  <span>Design, Motion, Interaction</span>
                </motion.div>

                <motion.div
                  className="journey-pill"
                  whileHover={{ scale: 1.05 }}
                >
                  <strong>Full-stack</strong>
                  <span>Node • APIs • Databases</span>
                </motion.div>

                <motion.div
                  className="journey-pill"
                  whileHover={{ scale: 1.05 }}
                >
                  <strong>Projects</strong>
                  <span>Practice & Production</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </GateOpening>
  );
}
