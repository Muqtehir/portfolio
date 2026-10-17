import { useEffect, useRef } from "react";
import { portfolio } from "../data/portfolio";

const SHARDS = [
  "90,120 165,210 112,290",
  "90,120 112,290 115,390",
  "90,390 115,390 165,300",
  "165,210 210,150 250,250",
  "165,210 250,250 165,300",
  "165,300 250,250 210,390",
  "210,390 250,250 290,390",
  "250,250 290,300 335,210",
  "290,300 335,210 360,290",
  "335,210 410,120 360,290",
  "360,290 410,120 410,390",
  "360,290 410,390 335,300",
  "165,210 250,250 210,150",
  "335,210 360,290 250,250",
  "250,250 335,210 290,390",
  "210,390 250,250 290,390",
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function MIntro({ onComplete }) {
  const overlayRef = useRef(null);
  const finishRef = useRef(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const root = document.documentElement;
    const isSimpleMode = root.dataset.introMode === "simple";
    const totalDuration = isSimpleMode ? 2000 : 3800;
    const revealStart = isSimpleMode ? 1500 : 3150;
    const revealDuration = 650;

    if (document.body) {
      document.body.classList.add("intro-active");
    }

    const path = overlay.querySelector(".intro-outline");
    const fill = overlay.querySelector(".intro-fill");
    const ghost = overlay.querySelector(".intro-ghost");
    const grid = overlay.querySelector(".intro-grid");
    const guideLines = [...overlay.querySelectorAll(".intro-guide")];
    const shards = [...overlay.querySelectorAll(".intro-shard")];
    const title = overlay.querySelector(".intro-title");
    const role = overlay.querySelector(".intro-role");
    const reveal = overlay.querySelector(".intro-reveal");
    const ring = overlay.querySelector(".intro-ring");

    const finishIntro = () => {
      if (finishRef.current) return;
      finishRef.current = true;
      if (document.body) {
        document.body.classList.remove("intro-active");
      }
      overlay.setAttribute("data-exit", "true");
      if (typeof onComplete === "function") {
        onComplete();
      }
    };

    const skipIntro = (event) => {
      if (event.key === "Escape") {
        finishIntro();
      }
    };

    window.addEventListener("keydown", skipIntro);

    const outlineLength = path.getTotalLength();
    path.style.strokeDasharray = `${outlineLength}`;
    path.style.strokeDashoffset = `${outlineLength}`;
    ghost.style.strokeDasharray = `${outlineLength}`;
    ghost.style.strokeDashoffset = `${outlineLength}`;
    if (fill) {
      fill.style.opacity = "0";
      fill.style.transform = "translateX(-28px) scaleX(0)";
      fill.style.transformOrigin = "left center";
    }

    guideLines.forEach((line) => {
      const dash = line.getTotalLength();
      line.style.strokeDasharray = `${dash}`;
      line.style.strokeDashoffset = `${dash}`;
    });

    const updateShard = (node, index, elapsed) => {
      const normalize = (value) => clamp(value, 0, 1);
      const driftAngle = (index / SHARDS.length) * Math.PI * 2;
      const radius = 32 + (index % 6) * 18;
      const offsetX = Math.cos(driftAngle) * radius;
      const offsetY = Math.sin(driftAngle) * radius * 0.8;
      const baseX = (index % 2 === 0 ? 1 : -1) * (index % 5) * 1.6;

      const t = normalize((elapsed - 950) / 550);
      const q = normalize((elapsed - 1750) / 900);
      const revealT = normalize((elapsed - revealStart) / revealDuration);

      let x = 0;
      let y = 0;
      let rotation = 0;
      const deconstruct = easeOutCubic(t);
      const reconstruct = easeInOutCubic(q);
      const reveal = easeOutCubic(revealT);

      if (elapsed < 950) {
        x = 0;
        y = 0;
        rotation = 0;
      } else if (elapsed < 1500) {
        x = offsetX * deconstruct;
        y = offsetY * deconstruct;
        rotation = (index % 2 === 0 ? 1 : -1) * deconstruct * 22;
      } else if (elapsed < 2650) {
        const spring = 1 + (1 - reconstruct) * 0.18;
        const restoreX = offsetX * (1 - reconstruct * 1.02);
        const restoreY = offsetY * (1 - reconstruct * 1.02);
        x = restoreX * spring;
        y = restoreY * spring;
        rotation = (index % 2 === 0 ? 1 : -1) * (1 - reconstruct) * 22;
      } else {
        x = 0;
        y = 0;
        rotation = 0;
      }

      if (elapsed >= revealStart) {
        const opening = clamp((elapsed - revealStart) / revealDuration, 0, 1);
        const extra = 1 - opening;
        node.style.opacity = `${Math.max(0, extra)}`;
      } else {
        node.style.opacity = "1";
      }

      node.style.transform = `translate(${x + baseX}px, ${y}px) rotate(${rotation}deg)`;
      node.style.filter = "none";
    };

    const start = performance.now();
    let rafId = null;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = clamp(elapsed / totalDuration, 0, 1);

      if (isSimpleMode) {
        const fadeIn = easeInOutCubic(clamp(elapsed / 1000, 0, 1));
        const fadeOut = easeInOutCubic(clamp((elapsed - 1500) / 500, 0, 1));
        title.style.opacity = String(fadeIn);
        role.style.opacity = String(fadeIn);
        title.style.transform = "translateY(0)";
        role.style.transform = "translateY(0)";
        fill.style.opacity = String(fadeIn * 0.95);
        fill.style.transform = "translateX(0) scaleX(1)";
        path.style.opacity = String(fadeIn);
        ghost.style.opacity = String(fadeIn * 0.35);
        grid.style.opacity = String(fadeIn * 0.28);
        overlay.style.opacity = String(1 - fadeOut * 1.1);
      } else {
        const lineProgress = clamp(elapsed / 850, 0, 1);
        const outlineProgress = clamp(elapsed / 850, 0, 1);
        const fillProgress = clamp((elapsed - 700) / 550, 0, 1);
        const titleProgress = clamp((elapsed - 600) / 800, 0, 1);
        const roleProgress = clamp((elapsed - 800) / 800, 0, 1);
        const revealProgress = clamp((elapsed - revealStart) / revealDuration, 0, 1);
        const ringPulse = clamp((elapsed - 2550) / 650, 0, 1);

        guideLines.forEach((line, index) => {
          const offset = line.getTotalLength() * (1 - Math.min(1, lineProgress * (0.82 + index * 0.04)));
          line.style.strokeDashoffset = `${offset}`;
          line.style.opacity = `${Math.min(1, lineProgress * 1.3)}`;
        });

        path.style.strokeDashoffset = `${outlineLength * (1 - outlineProgress)}`;
        ghost.style.strokeDashoffset = `${outlineLength * (1 - Math.min(1, outlineProgress * 1.1))}`;
        ghost.style.opacity = `${0.2 + outlineProgress * 0.4}`;

        const fillScale = Math.max(0, easeOutCubic(fillProgress));
        fill.style.opacity = String(fillScale * 0.95);
        fill.style.transform = `translateX(${(1 - fillScale) * 28}px) scaleX(${fillScale})`;

        title.style.opacity = String(easeOutCubic(titleProgress));
        role.style.opacity = String(easeOutCubic(roleProgress));
        title.style.transform = "translateY(0)";
        role.style.transform = "translateY(0)";

        if (grid) {
          grid.style.opacity = String(0.2 + lineProgress * 0.5);
        }

        if (ring) {
          const ringStrength = Math.sin(ringPulse * Math.PI) * 0.85 + 0.15;
          ring.style.opacity = String(Math.max(0, 0.12 + ringStrength));
          ring.style.transform = `scale(${0.8 + ringPulse * 1.25})`;
        }

        if (reveal) {
          reveal.style.opacity = String(1 - revealProgress * 0.9);
          reveal.style.transform = `translate(-50%, -50%) scale(${0.2 + revealProgress * 2.8})`;
        }

        shards.forEach((node, index) => {
          updateShard(node, index, elapsed);
        });

        overlay.style.opacity = String(1 - Math.max(0, revealProgress - 0.05) * 1.4);
      }

      if (elapsed >= totalDuration) {
        finishIntro();
        return;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("keydown", skipIntro);
      if (document.body) {
        document.body.classList.remove("intro-active");
      }
    };
  }, [onComplete]);

  return (
    <div className="m-intro" id="page-intro" ref={overlayRef} aria-hidden="true">
      <div className="intro-glow" aria-hidden="true" />
      <svg className="intro-svg" viewBox="0 0 500 500" role="img" aria-label="Initial animation for Muqtehir Mayaleeke">
        <defs>
          <linearGradient id="intro-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="intro-fill-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <g className="intro-grid">
          <path d="M 0 250 H 500" />
          <path d="M 250 0 V 500" />
          <path d="M 0 150 H 500" />
          <path d="M 0 350 H 500" />
          <path d="M 150 0 V 500" />
          <path d="M 350 0 V 500" />
          <path d="M 75 100 V 400" />
          <path d="M 425 100 V 400" />
        </g>
        <g className="intro-guides">
          <path className="intro-guide" d="M 90 390 V 120" />
          <path className="intro-guide" d="M 410 390 V 120" />
          <path className="intro-guide" d="M 90 120 L 195 295" />
          <path className="intro-guide" d="M 185 300 L 250 170" />
          <path className="intro-guide" d="M 250 170 L 315 300" />
          <path className="intro-guide" d="M 315 300 L 410 120" />
          <path className="intro-guide" d="M 90 390 L 410 390" />
        </g>
        <path className="intro-ghost" d="M 90 390 L 90 120 L 185 300 L 250 170 L 315 300 L 410 120 L 410 390 Z" />
        <path className="intro-outline" d="M 90 390 L 90 120 L 185 300 L 250 170 L 315 300 L 410 120 L 410 390" />
        <path
          className="intro-fill"
          d="M 90 390 L 90 120 L 185 300 L 250 170 L 315 300 L 410 120 L 410 390 Z"
          vectorEffect="non-scaling-stroke"
        />
        <g className="intro-shards-wrap">
          {SHARDS.map((points, index) => (
            <polygon key={points + index} className="intro-shard" points={points} />
          ))}
        </g>
        <circle className="intro-ring" cx="250" cy="250" r="142" />
      </svg>
      <div className="intro-type-wrap" aria-hidden="true">
        <div className="intro-title">{portfolio.name.toUpperCase()}</div>
        <div className="intro-role">Full-Stack Developer</div>
      </div>
      <div className="intro-reveal" aria-hidden="true" />
    </div>
  );
}
