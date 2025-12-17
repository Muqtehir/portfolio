import { motion } from "framer-motion";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";

export default function GateSkills({ onBack }) {
  const skillCategories = [
    { title: "Frontend", skills: ["React", "JavaScript", "CSS", "Vite"] },
    {
      title: "Backend",
      skills: ["Node.js", "Express", "MongoDB", "API Design"],
    },
    { title: "Tools", skills: ["Git", "VS Code", "npm", "Figma"] },
    {
      title: "Soft Skills",
      skills: ["Problem Solving", "Teamwork", "Learning", "Creativity"],
    },
  ];

  return (
    <GateOpening color="green">
      <motion.div
        className="gate-page green"
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
            SKILLS & EXPERTISE
          </motion.h1>

          <motion.div
            className="skills-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, staggerChildren: 0.1 }}
          >
            {skillCategories.map((category, idx) => (
              <motion.div
                key={idx}
                className="skill-category"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
              >
                <h3>{category.title}</h3>
                <ul>
                  {category.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </GateOpening>
  );
}
