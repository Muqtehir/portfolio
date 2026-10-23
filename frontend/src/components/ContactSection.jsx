import { createElement, useEffect, useRef, useState } from "react";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { LuCopy, LuDownload } from "react-icons/lu";
import { portfolio } from "../data/portfolio";
import { copyTextToClipboard, sendContactMessage } from "../utils/contact";
import MagneticAction from "./MagneticAction";
import Reveal from "./Reveal";

const contactMethods = [
  {
    label: "Email",
    value: portfolio.email,
    href: portfolio.emailLink,
    icon: MdEmail,
    copyable: true,
  },
  {
    label: "WhatsApp",
    value: portfolio.phone,
    href: portfolio.phoneLink,
    icon: FaWhatsapp,
  },
  {
    label: "GitHub",
    value: "GitHub",
    href: portfolio.github,
    icon: FaGithub,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "LinkedIn",
    href: portfolio.linkedin,
    icon: FaLinkedinIn,
    external: true,
  },
  ...["upwork", "fiverr"]
    .filter((key) => portfolio[key])
    .map((key) => ({
      label: key[0].toUpperCase() + key.slice(1),
      value: key[0].toUpperCase() + key.slice(1),
      href: portfolio[key],
      external: true,
    })),
];

export default function ContactSection() {
  const [formData, setFormData] = useState({ fullName: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const copyStatusTimer = useRef(null);
  const resumeHref = `${portfolio.resume.path}?v=${portfolio.resume.updated}`;

  useEffect(
    () => () => {
      if (copyStatusTimer.current) clearTimeout(copyStatusTimer.current);
    },
    [],
  );

  const handleCopyEmail = async () => {
    if (copyStatusTimer.current) clearTimeout(copyStatusTimer.current);

    try {
      await copyTextToClipboard(portfolio.email);
      setCopyStatus("copied");
    } catch (error) {
      console.error("Unable to copy email address:", error);
      setCopyStatus("error");
    }

    copyStatusTimer.current = setTimeout(() => setCopyStatus(""), 2000);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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

  return (
    <section className="section section-contact" id="contact">
      <div className="page-shell">
        <Reveal className="contact-panel">
          <div className="contact-intro">
            <p className="eyebrow">Have a project in mind?</p>
            <h2>Let&apos;s make something useful.</h2>
            <p>Let&apos;s connect! Reach out via email or WhatsApp</p>
            <p className="contact-availability">{portfolio.availability}</p>
            <div className="contact-methods">
              {contactMethods.map(({ label, value, href, icon: Icon, external, copyable }) => {
                const card = (
                  <a
                    className={`contact-method${copyable ? " contact-email-card" : ""}`}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                  >
                    {Icon && <span className="contact-icon">{createElement(Icon, { "aria-hidden": true })}</span>}
                    <span className="contact-method-copy">
                      <small>{label}</small>
                      <strong className={copyable ? "contact-email-address" : undefined}>
                        {copyable && value.includes("@")
                          ? <>{value.slice(0, value.indexOf("@") + 1)}<wbr />{value.slice(value.indexOf("@") + 1)}</>
                          : value}
                      </strong>
                    </span>
                    <span className="contact-arrow" aria-hidden="true">↗</span>
                  </a>
                );

                if (!copyable) return <div className="contact-method-row" key={label}>{card}</div>;

                return (
                  <div className="contact-email-group" key={label}>
                    {card}
                    <div className="contact-actions">
                      <button
                        className="copy-email-button"
                        type="button"
                        onClick={handleCopyEmail}
                        aria-label={copyStatus === "copied" ? portfolio.emailCopy.copied : portfolio.emailCopy.label}
                      >
                        <LuCopy aria-hidden="true" />
                        <span>{copyStatus === "copied" ? portfolio.emailCopy.copied : portfolio.emailCopy.label}</span>
                      </button>
                      {portfolio.resume.enabled && (
                        <a
                          className="copy-email-button resume-contact-download"
                          href={resumeHref}
                          download={portfolio.resume.downloadName}
                          aria-label="Download résumé (PDF)"
                        >
                          <LuDownload aria-hidden="true" />
                          <span>Download résumé (PDF)</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
              {copyStatus === "copied"
                ? portfolio.emailCopy.copied
                : copyStatus === "error"
                  ? portfolio.emailCopy.error
                  : ""}
            </span>
          </div>

          <div className="contact-form-wrap">
            <h3>Or send me a message using the form below</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@example.com"
              />
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
              <MagneticAction
                as="button"
                className="button button-dark submit-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "✉ SEND MESSAGE"}
              </MagneticAction>
              {submitStatus && (
                <p
                  className={`status-message ${submitStatus}`}
                  role="status"
                  aria-live="polite"
                >
                  {submitStatus === "success"
                    ? "Message sent successfully. Thanks for reaching out!"
                    : submitStatus === "configuration"
                      ? "Contact email is not configured yet. Add the EmailJS settings to the frontend environment."
                      : "We couldn't send your message. Please try again later."}
                </p>
              )}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
