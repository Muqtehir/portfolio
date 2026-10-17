import { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { portfolio } from "../data/portfolio";
import Reveal from "./Reveal";

const MotionArticle = motion.article;

export default function ProjectCard({ project, index }) {
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const [pointerPosition, setPointerPosition] = useState({
    x: "50%",
    y: "50%",
  });
  const labels = portfolio.projectLabels;

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    rotateX.set((0.5 - py) * 7);
    rotateY.set((px - 0.5) * 9);
    setPointerPosition({
      x: `${px * 100}%`,
      y: `${py * 100}%`,
    });
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    setPointerPosition({ x: "50%", y: "50%" });
  };

  return (
    <Reveal className="project-card-reveal" delay={index * 0.055}>
      <MotionArticle
        className={`project-card${project.isPlaceholder ? " project-placeholder" : ""}${project.featured ? " project-card-featured" : ""}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        style={{
          "--spotlight-x": pointerPosition.x,
          "--spotlight-y": pointerPosition.y,
          ...(reduceMotion ? {} : { rotateX, rotateY, transformPerspective: 1100 }),
        }}
      >
        <div className="project-content">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <dl className="project-details">
            <div>
              <dt>{labels.problem}</dt>
              <dd>{project.problem}</dd>
            </div>
            <div>
              <dt>{labels.solution}</dt>
              <dd>{project.solution}</dd>
            </div>
            <div>
              <dt>{labels.tech}</dt>
              <dd>
                <div className="project-tags" aria-label={labels.tech}>
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </dd>
            </div>
            <div>
              <dt>{labels.result}</dt>
              <dd>{project.result}</dd>
            </div>
          </dl>
          <div className="project-links">
            {project.live && (
              <a
                className="project-link"
                href={project.live}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${project.title} live`}
              >
                {labels.live} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.github && (
              <a
                className="project-link"
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${project.title} source on GitHub`}
              >
                <FaGithub aria-hidden="true" /> {labels.source} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </MotionArticle>
    </Reveal>
  );
}
