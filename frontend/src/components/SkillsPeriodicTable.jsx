import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { categories, skills, skillPanelCopy } from "../data/portfolio";
import { categoryIcons } from "../data/skillIcons";
import Reveal from "./Reveal";
import SkillDetailPanel from "./SkillDetailPanel";
import SkillTile from "./SkillTile";

export default function SkillsPeriodicTable() {
  const [filter, setFilter] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [launchSkillId, setLaunchSkillId] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 1023px)").matches,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const tileRefs = useRef([]);
  const focusReturnRef = useRef(null);
  const suppressFocusSelectionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const selectSkill = useCallback(
    (skill, launch = false, trigger = null) => {
      if (!launch && suppressFocusSelectionRef.current) {
        suppressFocusSelectionRef.current = false;
        return;
      }
      if (launch) focusReturnRef.current = trigger || document.activeElement;
      setSelectedSkill(skill);
      setSheetOpen(isMobile);
      setLaunchSkillId(launch ? skill.id : null);
    },
    [isMobile],
  );

  const closePanel = useCallback(() => {
    if (isMobile && sheetOpen) suppressFocusSelectionRef.current = true;
    setSelectedSkill(null);
    setSheetOpen(false);
    setLaunchSkillId(null);
  }, [isMobile, sheetOpen]);

  const clearLaunch = useCallback(() => setLaunchSkillId(null), []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && (selectedSkill || sheetOpen)) {
        closePanel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePanel, selectedSkill, sheetOpen]);

  const handleTileNavigation = (event, currentIndex) => {
    const directions = {
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
    };
    const direction = directions[event.key];
    if (!direction) return;

    event.preventDefault();
    const current = tileRefs.current[currentIndex]?.getBoundingClientRect();
    if (!current) return;

    const centerX = current.left + current.width / 2;
    const centerY = current.top + current.height / 2;
    const candidates = tileRefs.current
      .map((tile, index) => {
        if (!tile || index === currentIndex) return null;
        const bounds = tile.getBoundingClientRect();
        const dx = bounds.left + bounds.width / 2 - centerX;
        const dy = bounds.top + bounds.height / 2 - centerY;
        const primary = dx * direction[0] + dy * direction[1];
        const cross = Math.abs(dx * direction[1] - dy * direction[0]);
        return { index, primary, cross };
      })
      .filter(Boolean);
    const forward = candidates
      .filter(({ primary }) => primary > 1)
      .sort((a, b) => a.primary + a.cross * 1.5 - (b.primary + b.cross * 1.5));
    const target = forward[0] || candidates.sort((a, b) => a.primary - b.primary)[0];

    if (target) tileRefs.current[target.index]?.focus();
  };

  return (
    <section className="section section-muted" id="skills">
      <div className="page-shell">
        <Reveal className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">The tools behind the work</p>
            <h2>Periodic Table of My Stack</h2>
            <p>{skillPanelCopy.sectionPrompt}</p>
          </div>
          <span className="section-count">{skills.length} ELEMENTS</span>
        </Reveal>

        <Reveal className="skills-layout">
          <div
            className="skill-filters flex flex-wrap gap-2 mb-[22px]"
            aria-label={skillPanelCopy.filterLabel}
          >
            {["All", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                className={`filter-chip${filter === category ? " is-active" : ""}`}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="skills-workspace">
            <div className="skills-main">
              <LayoutGroup>
                <div className="periodic-grid grid">
                  <AnimatePresence>
                    {skills.map((skill, index) => (
                      <SkillTile
                        key={skill.id}
                        skill={skill}
                        number={String(index + 1).padStart(2, "0")}
                        index={index}
                        hasSelection={Boolean(selectedSkill)}
                        active={selectedSkill?.id === skill.id}
                        dimmed={filter !== "All" && skill.category !== filter}
                        tileRef={(element) => {
                          tileRefs.current[index] = element;
                        }}
                        onSelect={selectSkill}
                        onNavigate={handleTileNavigation}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </LayoutGroup>
              <div className="category-legend" aria-label={skillPanelCopy.legendLabel}>
                {categories.map((category) => {
                  const CategoryIcon = categoryIcons[category];

                  return (
                    <span key={category} className={`category-${category.toLowerCase()}`}>
                      <i className="legend-dot" aria-hidden="true" />
                      <CategoryIcon aria-hidden="true" />
                      {category}
                    </span>
                  );
                })}
              </div>
            </div>
            <SkillDetailPanel
              skill={selectedSkill}
              skills={skills}
              hiddenByFilter={filter !== "All" && selectedSkill?.category !== filter}
              isMobile={isMobile}
              isOpen={sheetOpen}
              launchSkillId={launchSkillId}
              onLaunchComplete={clearLaunch}
              onClose={closePanel}
              onNavigate={(skill) => selectSkill(skill)}
              focusReturnRef={focusReturnRef}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
