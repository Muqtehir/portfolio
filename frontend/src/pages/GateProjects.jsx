import { motion } from "framer-motion";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";

export default function GateProjects({ onBack }) {
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
            <p className="contact-message" style={{ marginBottom: "1rem" }}>
              Below is a professional project layout — add only GitHub links.
            </p>

            <ProjectsGrid />
          </motion.div>
        </div>
      </motion.div>
    </GateOpening>
  );
}

function ProjectsGrid() {
  const [projects] = useState([
    {
      id: 1,
      title: "Project One",
      desc: "Short description of project one.",
      tech: ["React", "Node"],
      github: "",
    },
    {
      id: 2,
      title: "Project Two",
      desc: "Short description of project two.",
      tech: ["Three.js", "Vite"],
      github: "",
    },
    {
      id: 3,
      title: "Project Three",
      desc: "Short description of project three.",
      tech: ["Express", "MongoDB"],
      github: "",
    },
  ]);

  return (
    <div className="projects-grid">
      {projects.map((p) => (
        <motion.div
          key={p.id}
          className="project-card"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: p.id * 0.08 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div>
              <h3>{p.title}</h3>
              <p className="desc">{p.desc}</p>
              <div className="project-tags">
                {p.tech.map((t, i) => (
                  <span
                    className="status unknown"
                    key={i}
                    style={{ marginRight: "8px" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-actions">
              <a
                className="github-btn"
                href={p.github || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${p.title} on GitHub`}
              >
                <FaGithub />
                <span style={{ marginLeft: 8 }}>
                  {p.github ? "View" : "Add Link"}
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
