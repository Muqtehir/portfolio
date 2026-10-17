import { createElement, lazy, Suspense, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { portfolio } from "../data/portfolio";
import Reveal from "./Reveal";
import MagneticAction from "./MagneticAction";
import useTheme from "../hooks/useTheme";
import { useIntroPhase } from "./intro/IntroPhaseContext";

const DarkHeroScene = lazy(() => import("./DarkHeroScene"));

export default function Hero() {
  const [storyOpen, setStoryOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const theme = useTheme();
  const { started } = useIntroPhase();

  return (
    <section className="hero-section page-shell" id="home">
      <div className={`hero-grid${theme === "dark" ? "" : " hero-grid--text-only"}`}>
        <Reveal className="hero-copy" introStarted={started}>
          <Reveal delay={0.04} introStarted={started}><p className="eyebrow"><span className="availability-dot" /> Portfolio / 2026</p></Reveal>
          <Reveal delay={0.1} introStarted={started}><p className="hero-greeting">Hi, I&apos;m {portfolio.name}</p></Reveal>
          <Reveal delay={0.16} introStarted={started}><h1>Full Stack Developer</h1></Reveal>
          <Reveal delay={0.22} introStarted={started}><p className="hero-bio">{portfolio.bio[0]}</p></Reveal>
          <Reveal delay={0.28} introStarted={started}>
            <div className="hero-actions">
              <MagneticAction className="button button-dark" href="#work">
                {portfolio.heroActions.workLabel} <span aria-hidden="true">↗</span>
              </MagneticAction>
              <MagneticAction className="button button-outline" href="#contact">
                {portfolio.heroActions.contactLabel}
              </MagneticAction>
            </div>
          </Reveal>
          <Reveal delay={0.32} introStarted={started}>
            <p className="hero-availability">{portfolio.heroAvailability}</p>
          </Reveal>
          <Reveal delay={0.34} introStarted={started}>
            <div className="hero-note">
              <span className="note-line" />
              <span>Thoughtful interfaces, practical full-stack solutions.</span>
            </div>
          </Reveal>
        </Reveal>

        {theme === "dark" && (
          <Reveal className="hero-visual has-dark-scene" delay={0.12} hoverY={4} introStarted={started}>
            <Suspense fallback={<div className="scene-skeleton" aria-hidden="true"><span /></div>}>
              <DarkHeroScene started={started} />
            </Suspense>
          </Reveal>
        )}
      </div>

      <Reveal className="about-panel" introStarted={started}>
        <div className="about-heading">
          <p className="eyebrow">A little about me</p>
          <h2>Curiosity became a journey.</h2>
          <p>{portfolio.story[0]}</p>
          <button
            className="text-button"
            type="button"
            aria-expanded={storyOpen}
            onClick={() => setStoryOpen((open) => !open)}
          >
            {storyOpen ? "Show less" : "Read my story"}
            <span aria-hidden="true">{storyOpen ? "−" : "+"}</span>
          </button>
        </div>
        <div className="focus-panel">
          <span className="mini-label">CURRENT FOCUS</span>
          {portfolio.currentFocus.map((item, index) => (
            <div className="focus-row" key={item}>
              <span className="focus-number">0{index + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {storyOpen &&
            createElement(
              motion.div,
              {
                key: "expanded-story",
                className: "expanded-story",
                initial: reduceMotion ? false : { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 },
                transition: { duration: reduceMotion ? 0 : 0.24, ease: "easeOut" },
              },
              <>
                {portfolio.story.slice(1).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className="journey-highlights">
                  {portfolio.journeyHighlights.map((highlight) => (
                    <div className="journey-highlight" key={highlight.title}>
                      <strong>{highlight.title}</strong>
                      <span>{highlight.detail}</span>
                    </div>
                  ))}
                </div>
                <p>{portfolio.futureLab}</p>
                <p>{portfolio.futureLabNote}</p>
              </>,
            )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
