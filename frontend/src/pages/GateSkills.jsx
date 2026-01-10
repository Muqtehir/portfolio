import { motion } from "framer-motion";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";
// icons
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGithub,
  SiGit,
  SiVisualstudiocode,
  SiNpm,
} from "react-icons/si";
import { FaFolder } from "react-icons/fa";

export default function GateSkills({ onBack }) {
  const skills = [
    {
      category: "FRONTEND",
      items: [
        {
          icon: SiHtml5,
          name: "HTML",
          points: [
            "Semantic structure",
            "Headings",
            "Forms",
            "Accessibility basics",
          ],
          status: "UNLOCKED",
        },
        {
          icon: SiCss3,
          name: "CSS",
          points: [
            "Flexbox",
            "CSS Grid",
            "Responsive design",
            "Media queries",
            "Animations & transitions",
          ],
          status: "UNLOCKED",
        },
        {
          icon: SiJavascript,
          name: "JavaScript",
          points: [
            "DOM manipulation",
            "Event handling",
            "Functions & basic logic",
            "Working with APIs (fetch)",
            "Basic debugging",
          ],
          status: "UNLOCKED",
        },
        {
          icon: SiReact,
          name: "React",
          points: [
            "Functional components",
            "Props & state",
            "useState and basic useEffect",
            "Component structure",
            "Connecting frontend to backend",
          ],
          status: "IN PROGRESS",
        },
      ],
    },
    {
      category: "BACKEND",
      items: [
        { icon: SiNodedotjs, name: "Node.js", points: [], status: "UNLOCKED" },
        { icon: SiExpress, name: "Express.js", points: [], status: "UNLOCKED" },
        {
          icon: "🔁",
          name: "Creating REST APIs",
          points: [],
          status: "IN PROGRESS",
        },
        {
          icon: "📨",
          name: "Handling requests & responses",
          points: [],
          status: "IN PROGRESS",
        },
        { icon: SiMongodb, name: "MongoDB", points: [], status: "UNLOCKED" },
        { icon: "🧩", name: "Mongoose", points: [], status: "IN PROGRESS" },
        {
          icon: "🛠️",
          name: "CRUD operations",
          points: [],
          status: "IN PROGRESS",
        },
        {
          icon: "🔐",
          name: "Environment variables (dotenv)",
          points: [],
          status: "IN PROGRESS",
        },
        {
          icon: "🔗",
          name: "Connecting backend to frontend",
          points: [],
          status: "IN PROGRESS",
        },
      ],
    },
    {
      category: "TOOLS & WORKFLOW",
      items: [
        { icon: SiVisualstudiocode, name: "VS Code", points: [] },
        { icon: SiGit, name: "Git (add, commit, push)", points: [] },
        {
          icon: SiGithub,
          name: "GitHub (repositories, basic workflow)",
          points: [],
        },

        { icon: "🤖", name: "Using AI tools effectively", points: [] },
        { icon: SiNpm, name: "npm", points: [] },
        { icon: FaFolder, name: "Project folder structuring", points: [] },
        { icon: "▶️", name: "Running local dev servers", points: [] },
      ],
    },
    {
      category: "UX / DESIGN THINKING",
      items: [
        { icon: "📖", name: "Story-driven UI concepts", points: [] },
        { icon: "🎮", name: "Game-inspired navigation", points: [] },
        {
          icon: "🧭",
          name: "Thinking in user experience, not just pages",
          points: [],
        },
        { icon: "⏱️", name: "Animation timing and flow", points: [] },
        { icon: "🔍", name: "Visual hierarchy", points: [] },
      ],
    },
    {
      category: "LEARNING & GROWTH",
      items: [
        { icon: "🐞", name: "Reading error messages", points: [] },
        { icon: "❓", name: "Asking the right questions", points: [] },
        { icon: "🔁", name: "Improving based on feedback", points: [] },
        {
          icon: "🔄",
          name: "Willingness to restart and fix things properly",
          points: [],
        },
        { icon: "🌱", name: "Long-term learning mindset", points: [] },
      ],
    },
  ];

  const statusClass = (status) => {
    if (!status) return "status unknown";
    const map = {
      UNLOCKED: "status unlocked",
      "IN PROGRESS": "status in-progress",
      LOCKED: "status locked",
    };
    return (
      map[status] ||
      "status " + String(status).toLowerCase().replace(/\s+/g, "-")
    );
  };

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
            transition={{ delay: 0.8 }}
          >
            {skills.map((group, gi) => (
              <div key={gi} className="skill-group">
                <h3 className="skill-category">{group.category}</h3>

                <div className="skill-items">
                  {group.items.map((it, idx) => (
                    <motion.div
                      key={idx}
                      className="skill-card"
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9 + idx * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="skill-header">
                        {it.icon &&
                          // render icon component or raw string
                          (typeof it.icon === "function" ? (
                            <it.icon className="skill-icon" />
                          ) : (
                            <span className="skill-icon">{it.icon}</span>
                          ))}
                        <strong>{it.name}</strong>
                        {it.status && (
                          <span className={statusClass(it.status)}>
                            {it.status}
                          </span>
                        )}
                      </div>
                      <ul>
                        {it.points.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </GateOpening>
  );
}
