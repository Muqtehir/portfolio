import { skills } from "../data/portfolio";

export default function TechMarquee() {
  return (
    <div className="tech-marquee" role="region" aria-label="Technologies in my stack">
      <div className="tech-marquee-track">
        {[0, 1].map((copy) => (
          <div className="tech-marquee-group" key={copy} aria-hidden={copy === 1}>
            {skills.map((skill) => {
              const label =
                skill.status === "learning"
                  ? `${skill.name} — ${skill.status}`
                  : skill.name;
              return <span key={skill.id}>{label}</span>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
