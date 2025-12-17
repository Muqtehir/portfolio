import { motion } from "framer-motion";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";

export default function GateProjects({ onBack }) {
  const projects = [
    {
      name: "Portfolio Website",
      desc: "Interactive 3D portfolio with storytelling",
      tech: "React, Three.js, Framer Motion",
    },
    {
      name: "E-commerce Platform",
      desc: "Full-stack shopping experience",
      tech: "MERN Stack",
    },
    {
      name: "Task Manager App",
      desc: "Collaborative task management tool",
      tech: "React, Firebase",
    },
  ];

  return (
    <GateOpening color="blue">
      <motion.div
        className="gate-page blue"
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
            MY PROJECTS
          </motion.h1>

          <motion.div
            className="projects-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                className="project-card"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.15 }}
                whileHover={{ x: 10 }}
              >
                <h3>{project.name}</h3>
                <p className="desc">{project.desc}</p>
                <p className="tech">Tech: {project.tech}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </GateOpening>
  );
}
