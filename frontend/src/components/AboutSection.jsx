import { portfolio } from "../data/portfolio";
import Reveal from "./Reveal";

export default function AboutSection() {
  const { aboutSection } = portfolio;

  return (
    <section className="about-new-section" id="about" aria-labelledby="about-heading" tabIndex="-1">
      <div className="page-shell">
        <Reveal className="about-new-layout">
          <div className="about-new-copy">
            <h2 id="about-heading">{aboutSection.heading}</h2>
            <p>{aboutSection.text}</p>
          </div>
          <aside className="about-exploring" aria-labelledby="about-exploring-heading">
            <h3 id="about-exploring-heading">{aboutSection.exploringHeading}</h3>
            <ul>
              {aboutSection.exploring.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
