import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { portfolio } from "../data/portfolio";
import Reveal from "./Reveal";

export default function BuildProcess() {
  const trackRef = useRef(null);
  const isInView = useInView(trackRef, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const { buildProcess } = portfolio;

  return (
    <section className="section build-process-section" aria-labelledby="build-process-heading" tabIndex="-1">
      <div className="page-shell">
        <Reveal className="section-heading">
          <h2 id="build-process-heading">{buildProcess.heading}</h2>
        </Reveal>
        <div
          className={`build-track${isInView || reduceMotion ? " is-in-view" : ""}`}
          ref={trackRef}
        >
          <span className="build-connector" aria-hidden="true" />
          <ol className="build-steps">
            {buildProcess.steps.map((step, index) => (
              <li className="build-step" key={step.title}>
                <span className="build-step-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="build-step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
