import { skills } from "../data/portfolio";

const techNames = skills.map((skill) => skill.name);

export default function TechMarquee() {
  return (
    <div className="tech-marquee" role="region" aria-label="Technologies in my stack">
      <div className="tech-marquee-track">
        {[0, 1].map((copy) => (
          <div className="tech-marquee-group" key={copy} aria-hidden={copy === 1}>
            {techNames.map((name, index) => {
              const skill = skills[index];
              const label =
                skill.status === "learning" ? `${name} — ${skill.status}` : name;
              return <span key={name}>{label}</span>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
