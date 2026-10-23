import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuFileText } from "react-icons/lu";
import { portfolio } from "../data/portfolio";
import useActiveSection from "../hooks/useActiveSection";
import LiquidGlass from "./LiquidGlass";
import ThemeToggle from "./ThemeToggle";
import useTheme from "../hooks/useTheme";

const MotionSpan = motion.span;
const links = portfolio.navigation.links;
const sectionIds = links.map(({ href }) => href.slice(1));

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const theme = useTheme();
  const { activeSection, navigateToSection } = useActiveSection(sectionIds);
  const resumeHref = `${portfolio.resume.path}?v=${portfolio.resume.updated}`;

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const handleNavigation = (event, id) => {
    closeMenu();
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;
    event.preventDefault();
    navigateToSection(id);
  };

  return (
    <header className="site-header">
      <LiquidGlass
        as="nav"
        className={`navbar page-shell${menuOpen ? " is-menu-open" : ""}${portfolio.resume.enabled ? " has-resume" : ""}`}
        variant="nav"
        interactive
        aria-label="Main navigation"
      >
        <a
          className="brand"
          href="#home"
          aria-label={`${portfolio.name} home`}
          onClick={(event) => handleNavigation(event, "home")}
        >
          <span className="brand-mark">M.</span>
          <span>{portfolio.name}</span>
        </a>
        <div className={`nav-links${menuOpen ? " is-open" : ""}`} id="primary-navigation">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              aria-current={activeSection === href.slice(1) ? "location" : undefined}
              onClick={(event) => handleNavigation(event, href.slice(1))}
            >
              <span className="nav-link-label">{label}</span>
              {theme === "dark" && activeSection === href.slice(1) && (
                <MotionSpan
                  key={href}
                  className="nav-active-capsule"
                  layoutId={reduceMotion ? undefined : "active-nav-section"}
                  initial={reduceMotion ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.12 }
                      : { type: "spring", stiffness: 420, damping: 34 }
                  }
                  aria-hidden="true"
                />
              )}
            </a>
          ))}
        </div>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation mobile-navigation-panel"
          ref={menuButtonRef}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>
        {portfolio.resume.enabled && (
          <a
            className="nav-resume"
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open résumé (PDF, opens in a new tab)"
            data-tooltip="Open résumé (PDF, opens in a new tab)"
          >
            <LuFileText aria-hidden="true" />
            <span className="nav-resume-label">{portfolio.resume.label}</span>
          </a>
        )}
        <LiquidGlass
          as="a"
          className="nav-cta"
          href="#contact"
          onClick={(event) => handleNavigation(event, "contact")}
          variant="button"
          interactive
        >
          {portfolio.navigation.hireMeLabel} <span aria-hidden="true">↗</span>
        </LiquidGlass>
        <ThemeToggle />
        <AnimatePresence>
          {menuOpen && (
            <LiquidGlass
              key="mobile-navigation-panel"
              id="mobile-navigation-panel"
              className="nav-mobile-panel"
              variant="panel"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
              transition={
                reduceMotion
                  ? { duration: 0.12 }
                  : { type: "spring", stiffness: 420, damping: 32 }
              }
              role="region"
              aria-label="Mobile navigation"
            >
              <LiquidGlass
                as="a"
                className="nav-mobile-cta"
                href="#contact"
                onClick={(event) => handleNavigation(event, "contact")}
                variant="button"
                interactive
              >
                <span>
                  {portfolio.navigation.hireMeLabel} <span aria-hidden="true">↗</span>
                </span>
              </LiquidGlass>
              {portfolio.resume.enabled && (
                <a
                  className="nav-mobile-resume"
                  href={resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open résumé (PDF, opens in a new tab)"
                  onClick={closeMenu}
                >
                  <LuFileText aria-hidden="true" />
                  <span>{portfolio.resume.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              )}
              <ul className="nav-mobile-links">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      aria-current={activeSection === href.slice(1) ? "location" : undefined}
                      onClick={(event) => handleNavigation(event, href.slice(1))}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </LiquidGlass>
          )}
        </AnimatePresence>
      </LiquidGlass>
    </header>
  );
}
