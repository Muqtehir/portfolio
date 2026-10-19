import { portfolio, skills } from "../data/portfolio";
import Reveal from "./Reveal";

export default function ProfileSections() {
  const timelineItems = Array.from({
    length: Math.max(portfolio.education.length, portfolio.experience.length),
  }).flatMap((_, index) => [
    portfolio.education[index] && {
      ...portfolio.education[index],
      type: "education",
    },
    portfolio.experience[index] && {
      ...portfolio.experience[index],
      type: "experience",
    },
  ].filter(Boolean));

  return (
    <>
      <section className="section section-muted" id="certifications">
        <div className="page-shell">
          <Reveal className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Learning &amp; credentials</p>
              <h2>Certifications</h2>
            </div>
            <span className="section-count">
              {portfolio.certifications.length} CERTIFICATES
            </span>
          </Reveal>
          <Reveal className="certificate-grid">
            {portfolio.certifications.map((certificate) => (
              <article className="certificate-card" key={certificate.file}>
                <div className="certificate-preview">
                  <img
                    src={certificate.preview}
                    alt={`Preview of ${certificate.title}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="certificate-details">
                  <div>
                    <span className="mini-label">Certificate</span>
                    <h3>{certificate.title}</h3>
                    {certificate.issuer && <span>{certificate.issuer}</span>}
                  </div>
                  <a
                    className="certificate-open-link"
                    href={certificate.file}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${certificate.title} in a new tab`}
                  >
                    Open full certificate <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="section section-muted experience-section"
        id="education"
        aria-labelledby="education-title"
      >
        <div className="page-shell">
          <Reveal className="section-heading experience-heading">
            <p className="eyebrow">{portfolio.journeySection.eyebrow}</p>
            <h2 id="education-title">{portfolio.journeySection.headline}</h2>
            <p>{portfolio.journeySection.subheadline}</p>
          </Reveal>
          <div className="experience-column-labels" aria-hidden="true">
            <span>{portfolio.journeySection.educationLabel}</span>
            <span>{portfolio.journeySection.experienceLabel}</span>
          </div>
          <ol className="experience-timeline">
            {timelineItems.map((item) => {
              const isEducation = item.type === "education";
              const categoryLabel = isEducation
                ? portfolio.journeySection.educationLabel
                : portfolio.journeySection.experienceLabel;

              return (
                <li
                  className={`experience-timeline-item is-${item.type}${item.optional ? " is-optional" : ""}`}
                  key={`${item.type}-${item.title}`}
                >
                  <span className="experience-timeline-node" aria-hidden="true" />
                  <Reveal className="journey-card">
                    <span className="mini-label">{categoryLabel}</span>
                    {item.optional && (
                      <span className="journey-optional-label">
                        {portfolio.journeySection.optionalLabel}
                      </span>
                    )}
                    <h3>{item.title}</h3>
                    <p className="journey-card-meta">{item.meta}</p>
                    {item.text && <p className="journey-card-text">{item.text}</p>}
                    {item.bullets && (
                      <ul className="journey-card-bullets">
                        {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                      </ul>
                    )}
                    {item.technologies && (
                      <ul
                        className="journey-tech-tags"
                        aria-label={portfolio.journeySection.technologiesLabel}
                      >
                        {item.technologies.map((technology) => (
                          <li key={technology}>{technology}</li>
                        ))}
                      </ul>
                    )}
                    {item.optionalBadge && (
                      <span className="journey-placeholder-badge">
                        {item.optionalBadge}
                      </span>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ol>
          <ul
            className="journey-stats"
            aria-label={portfolio.journeySection.statsLabel}
          >
            {portfolio.stats.map((stat) => {
              const value = stat.source === "projects"
                ? portfolio.projects.length
                : stat.source === "skills"
                  ? new Set(skills.map((skill) => skill.name)).size
                  : stat.value;

              return (
                <li
                  className={`journey-stat${stat.kind === "text" ? " journey-stat-text" : ""}`}
                  key={stat.label || stat.value}
                >
                  <strong>{value}</strong>
                  {stat.label && <span>{stat.label}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section" id="moments">
        <div className="page-shell">
          <Reveal className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Milestones &amp; achievements</p>
              <h2>Proud Moments</h2>
            </div>
            <span className="section-count">3 HIGHLIGHTS</span>
          </Reveal>
          <Reveal className="placeholder-grid">
            {portfolio.milestones.map((milestone) => (
              <article className="placeholder-card" key={milestone.title}>
                <span className="placeholder-icon" aria-hidden="true">↗</span>
                <h3>{milestone.title}</h3>
                <p>{milestone.text}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
