import { motion } from "framer-motion";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";

export default function GateContact({ onBack }) {
  const contacts = [
    {
      icon: "📧",
      label: "Email",
      value: "muqtehir@email.com",
      link: "mailto:muqtehir@email.com",
    },
    { icon: "🔗", label: "LinkedIn", value: "Muqtehir", link: "#" },
    { icon: "💻", label: "GitHub", value: "muqtehir", link: "#" },
    {
      icon: "🐦",
      label: "Twitter",
      value: "izzatudeenmuqtehir@gmail.com",
      link: "izzatudeenmuqtehir@gmail.com",
    },
  ];

  return (
    <GateOpening color="gold">
      <motion.div
        className="gate-page gold"
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
            GET IN TOUCH
          </motion.h1>

          <motion.div
            className="contact-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, staggerChildren: 0.1 }}
          >
            {contacts.map((contact, idx) => (
              <motion.a
                key={idx}
                href={contact.link}
                className="contact-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="contact-icon">{contact.icon}</div>
                <h3>{contact.label}</h3>
                <p>{contact.value}</p>
              </motion.a>
            ))}
          </motion.div>

          <motion.p
            className="contact-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Let's build something amazing together!
          </motion.p>
        </div>
      </motion.div>
    </GateOpening>
  );
}
