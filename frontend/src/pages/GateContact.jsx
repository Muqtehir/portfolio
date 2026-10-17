import { motion } from "framer-motion";
import { useState } from "react";
import GateOpening from "../components/GateOpening";
import "../styles/gate-page.css";
import { portfolio } from "../data/portfolio";
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { sendContactMessage } from "../utils/contact";

export default function GateContact({ onBack }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await sendContactMessage(formData);
      setSubmitStatus("success");
      setFormData({ fullName: "", email: "", message: "" });
    } catch (error) {
      console.error("Unable to send contact form:", error);
      setSubmitStatus(
        error.code === "EMAILJS_CONFIG_MISSING" ? "configuration" : "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: MdEmail,
      label: "Email",
      value: portfolio.email,
      link: portfolio.emailLink,
      color: "#D44638",
      bgColor: "rgba(212, 70, 56, 0.06)",
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      value: "08060795403",
      link: "https://wa.me/2348060795403",
      color: "#25D366",
      bgColor: "rgba(37, 211, 102, 0.06)",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

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
            ✨ GET IN TOUCH ✨
          </motion.h1>

          <motion.p
            className="contact-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Let's connect! Reach out via email or WhatsApp
          </motion.p>

          {/* Contact Methods */}
          <motion.div
            className="contact-methods"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <motion.a
                  key={idx}
                  href={method.link}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-method-card"
                  variants={itemVariants}
                  style={{
                    borderColor: method.color,
                    backgroundColor: method.bgColor,
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 0 30px ${method.color}80`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="contact-method-icon"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ color: method.color, fontSize: "2.5rem" }}
                  >
                    {Icon ? <Icon /> : method.icon}
                  </motion.div>
                  <h3 style={{ color: method.color }}>{method.label}</h3>
                  <p>{method.value}</p>
                </motion.a>
              );
            })}
          </motion.div>

          {/* Form Section */}
          <motion.div
            className="contact-form-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="form-title">
              📝 Or send me a message using the form below
            </h2>

            <form onSubmit={handleSubmit} className="contact-form">
              <motion.div
                className="form-group"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </motion.div>

              {/* Subject field removed */}

              <motion.div
                className="form-group"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell me about your project, idea, or inquiry..."
                  rows="5"
                />
              </motion.div>

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? "Sending…" : "✉️ SEND MESSAGE"}
              </motion.button>

              {submitStatus && (
                <motion.div
                  className={`status-message ${submitStatus}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  role="status"
                  aria-live="polite"
                >
                  {submitStatus === "success"
                    ? "Message sent successfully. Thanks for reaching out!"
                    : submitStatus === "configuration"
                      ? "Contact email is not configured yet. Add the EmailJS settings to the frontend environment."
                      : "We couldn't send your message. Please try again later."}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </motion.div>
    </GateOpening>
  );
}
