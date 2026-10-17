import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaGithub } from "react-icons/fa";
import { portfolio } from "../data/portfolio";
import Reveal from "./Reveal";

const MotionDiv = motion.div;
const DESKTOP_PEEK = 56;
const MOBILE_PEEK = 28;

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef(null);
  const touchStartX = useRef(null);
  const reduceMotion = useReducedMotion();
  const projects = portfolio.projects;
  const activeProject = projects[activeIndex];
  const peek = stageWidth <= 680 ? MOBILE_PEEK : DESKTOP_PEEK;
  const slideGap = stageWidth <= 680 ? 16 : 22;
  const slideWidth = Math.max(0, stageWidth - peek * 2);
  const slideOffset = peek - activeIndex * (slideWidth + slideGap);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const updateStageWidth = () => {
      setStageWidth(stage.getBoundingClientRect().width);
    };
    const observer = new ResizeObserver(updateStageWidth);
    updateStageWidth();
    observer.observe(stage);
    window.addEventListener("resize", updateStageWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateStageWidth);
    };
  }, []);

  const goTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(index, projects.length - 1)));
  };

  const handleKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest("a, button")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 45) goTo(activeIndex + (distance < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <section className="section projects-section" id="work">
      <div className="page-shell">
        <Reveal className="section-heading section-heading-row projects-heading">
          <div>
            <p className="eyebrow">Selected work · 2024—26</p>
            <h2>Things I&apos;ve Built</h2>
            <p>A considered selection of ideas brought to life on the web.</p>
          </div>
          <a className="text-link" href={portfolio.github} target="_blank" rel="noreferrer">
            Browse GitHub <span aria-hidden="true">↗</span>
          </a>
        </Reveal>

        <div
          className="project-carousel-stage"
          ref={stageRef}
          role="region"
          aria-label="Featured projects"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <MotionDiv
            className="project-slider-track"
            style={{ gap: slideGap }}
            animate={{ x: slideOffset }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 105, damping: 24, mass: 0.85 }
            }
          >
            {projects.map((project, index) => {
              const isActive = index === activeIndex;
              const liveUrl = project.liveUrl || project.live;
              const githubUrl = project.githubUrl || project.github;

              return (
                <article
                  className={`project-slide${isActive ? " is-active" : ""}`}
                  key={project.id}
                  style={{ width: slideWidth }}
                  aria-label={`${project.number}: ${project.title}`}
                  aria-roledescription="slide"
                  aria-hidden={!isActive}
                  inert={!isActive}
                >
                  <div className="project-slide-copy">
                    <div className="project-slide-meta">
                      <span className="project-slide-number">{project.number}</span>
                      <span className="project-slide-category">{project.category}</span>
                    </div>

                    <motion.div
                      key={project.id}
                      className="project-slide-body"
                      initial={reduceMotion ? false : { opacity: 0, y: 9 }}
                      animate={{ opacity: isActive ? 1 : 0.62, y: 0 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: "easeOut" }}
                    >
                      <h3 className="project-slide-title">{project.title}</h3>
                      <p className="project-slide-description">{project.description}</p>

                      <ul className="project-feature-list" aria-label="Key features">
                        {project.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>

                      <div className="project-slide-technologies" aria-label="Technologies used">
                        {project.technologies.map((technology) => (
                          <span className="project-tech-tag" key={technology}>
                            {technology}
                          </span>
                        ))}
                      </div>

                      <div className="project-slide-actions">
                        {liveUrl && (
                          <a className="project-primary-action" href={liveUrl} target="_blank" rel="noreferrer">
                            View project <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        {githubUrl && (
                          <a
                            className={liveUrl ? "project-source-action" : "project-primary-action"}
                            href={githubUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FaGithub aria-hidden="true" />
                            {liveUrl ? "Source" : "View on GitHub"}
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        {!liveUrl && !githubUrl && (
                          <span className="project-unavailable">
                            Project details available on request
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <div className={`project-slide-visual${project.imageFit === "contain" ? " project-slide-visual--contain" : ""}`}>
                    <img
                      src={project.image}
                      alt={`Project preview for ${project.title}`}
                      draggable="false"
                    />
                    <span className="project-visual-caption">Project preview</span>
                  </div>
                </article>
              );
            })}
          </MotionDiv>
        </div>

        <div className="project-carousel-controls">
          <p className="project-carousel-status" aria-live="polite" aria-atomic="true">
            <span>{activeProject.number}</span>
            <span className="project-status-divider" aria-hidden="true">/</span>
            {String(projects.length).padStart(2, "0")}
            <span className="project-status-title">{activeProject.title}</span>
          </p>
          <div className="project-carousel-pagination" aria-label="Choose a project">
            {projects.map((project, index) => (
              <button
                className={`project-pagination-dot${index === activeIndex ? " is-active" : ""}`}
                key={project.id}
                type="button"
                aria-label={`Show project ${project.number}: ${project.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <div className="project-carousel-arrows">
            <button
              className="project-arrow"
              type="button"
              aria-label="Previous project"
              disabled={activeIndex === 0}
              onClick={() => goTo(activeIndex - 1)}
            >
              <FaArrowLeft aria-hidden="true" />
            </button>
            <button
              className="project-arrow"
              type="button"
              aria-label="Next project"
              disabled={activeIndex === projects.length - 1}
              onClick={() => goTo(activeIndex + 1)}
            >
              <FaArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
