import { Component, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import useStageLoop from "../hooks/useStageLoop";

function StaticOrb() {
  return (
    <div className="static-orb" aria-hidden="true">
      <span />
    </div>
  );
}

class CanvasErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("3D hero scene failed to render; showing the static fallback.", error);
  }

  render() {
    return this.state.failed ? <StaticOrb /> : this.props.children;
  }
}

function OrbitingShapes({ colors }) {
  const group = useRef(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group}>
      <mesh position={[1.55, 0.62, 0]}>
        <octahedronGeometry args={[0.17, 0]} />
        <meshStandardMaterial color={colors.cyan} emissive={colors.cyan} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-1.5, -0.5, 0.25]} rotation={[0.4, 0.2, 0.7]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial color={colors.pink} emissive={colors.pink} emissiveIntensity={1.1} />
      </mesh>
      <mesh position={[0.45, 1.55, -0.35]}>
        <tetrahedronGeometry args={[0.19, 0]} />
        <meshStandardMaterial color={colors.lime} emissive={colors.lime} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-0.65, 1.15, 0.55]}>
        <torusGeometry args={[0.13, 0.045, 10, 28]} />
        <meshStandardMaterial color={colors.amber} emissive={colors.amber} emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

function FloatingCore({ target, colors }) {
  const core = useRef(null);

  useFrame((state, delta) => {
    if (!core.current) return;
    const ease = 1 - Math.exp(-delta * 3.5);
    core.current.rotation.y += delta * 0.2;
    core.current.rotation.x += (target.current.y * 0.2 - core.current.rotation.x) * ease;
    core.current.rotation.z += (target.current.x * 0.2 - core.current.rotation.z) * ease;
    core.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.08;
  });

  return (
    <mesh ref={core}>
      <icosahedronGeometry args={[1, 3]} />
      <MeshDistortMaterial
        color={colors.violet}
        emissive={colors.violet}
        emissiveIntensity={0.7}
        roughness={0.16}
        metalness={0.62}
        distort={0.34}
        speed={1.25}
      />
    </mesh>
  );
}

function SceneContents({ target, colors }) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <pointLight position={[3, 2.5, 3]} color={colors.violet} intensity={38} distance={9} />
      <pointLight position={[-3, -1, 2]} color={colors.cyan} intensity={30} distance={8} />
      <pointLight position={[0, 3, -2]} color={colors.pink} intensity={26} distance={7} />
      <FloatingCore target={target} colors={colors} />
      <OrbitingShapes colors={colors} />
    </>
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch (error) {
    console.warn("WebGL capability check failed:", error);
    return false;
  }
}

const stageColors = ["#22d3ee", "#8b5cf6", "#f472b6"];

function getStageWeights(progress) {
  const position = Math.max(0, Math.min(3, progress));
  if (position < 1) return [1 - position, position, 0];
  if (position < 2) return [0, 2 - position, position - 1];
  return [position - 2, 0, 3 - position];
}

function blendColor(first, second, amount) {
  const left = Number.parseInt(first.slice(1), 16);
  const right = Number.parseInt(second.slice(1), 16);
  const channels = [16, 8, 0].map((shift) => {
    const start = (left >> shift) & 255;
    const end = (right >> shift) & 255;
    return Math.round(start + (end - start) * amount);
  });
  return `rgb(${channels.join(" ")})`;
}

function accentAt(progress) {
  const position = Math.max(0, Math.min(3, progress));
  const segment = Math.min(Math.floor(position), 2);
  const amount = position - segment;
  return blendColor(stageColors[segment], stageColors[(segment + 1) % 3], amount);
}

function StageIcon({ stage }) {
  if (stage === 1) {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="m3 12 1-3 7-7 3 3-7 7-3 1Z" />
        <path d="m9.5 3.5 3 3M3 14h10" />
      </svg>
    );
  }
  if (stage === 2) {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m8 1 1.4 4.6L14 7l-4.6 1.4L8 13l-1.4-4.6L2 7l4.6-1.4L8 1Z" />
      <path d="m13 10 .7 2.3L16 13l-2.3.7L13 16l-.7-2.3L10 13l2.3-.7L13 10Z" />
    </svg>
  );
}

function DesignBlueprint() {
  return (
    <div className="design-blueprint" aria-hidden="true">
      <svg viewBox="0 0 360 360">
        <g className="design-dimensions">
          <path d="M58 48h244M58 43v10m30-8v6m30-8v10m30-8v6m30-8v10m30-8v6m30-8v10m30-8v6m30-8v10" />
          <path d="M44 76v208m-5-208h10m-8 28h6m-8 28h10m-8 28h6m-8 28h10m-8 28h6m-8 28h10m-8 28h6m-8 28h10" />
          <path d="M58 48 75 77m227-29-17 29M44 284l25-12m-25 12 25 12" />
        </g>
        <g className="design-sphere">
          <circle className="design-wire design-wire--outer" cx="180" cy="180" r="104" pathLength="1" />
          <ellipse className="design-wire design-wire--latitude" cx="180" cy="180" rx="104" ry="38" pathLength="1" />
          <ellipse className="design-wire design-wire--longitude" cx="180" cy="180" rx="38" ry="104" pathLength="1" />
          <path className="design-wire design-wire--arc" d="M108 105c41 50 103 100 144 150" pathLength="1" />
          <path className="design-wire design-wire--arc" d="M252 105c-41 50-103 100-144 150" pathLength="1" />
          <path className="design-wire design-wire--axis" d="M68 180h224M180 68v224" pathLength="1" />
        </g>
        <g className="design-handles">
          <path d="m104 112-22-17m22 17 18-21m-18 21h-18m162-16-20 17m20-17 20-18m-20 18h18m-44 174-18-19m18 19 19 16m-19-16v-19" />
          <circle cx="82" cy="95" r="2.5" />
          <circle cx="122" cy="91" r="2.5" />
          <circle cx="244" cy="96" r="2.5" />
          <circle cx="264" cy="78" r="2.5" />
          <circle cx="226" cy="271" r="2.5" />
          <circle cx="245" cy="287" r="2.5" />
        </g>
        <g className="design-anchors">
          <rect x="99" y="107" width="10" height="10" />
          <rect x="247" y="91" width="10" height="10" />
          <rect x="215" y="265" width="10" height="10" />
          <rect x="175" y="63" width="10" height="10" />
        </g>
        <g className="design-swatches">
          <rect x="61" y="310" width="18" height="12" rx="2" />
          <rect x="85" y="310" width="18" height="12" rx="2" />
          <rect x="109" y="310" width="18" height="12" rx="2" />
          <path d="M61 330h66" />
        </g>
        <g className="design-cursor">
          <path d="m57 167 3 18 5-5 5 8 3-2-5-8 7-1-15-10Z" />
        </g>
      </svg>
    </div>
  );
}

const buildPanels = [
  { d: "M150 59 181 77 165 112 128 111 119 79Z", x: -70, y: -54, tone: "a" },
  { d: "m181 77 35 20-3 38-48-23Z", x: 74, y: -66, tone: "b" },
  { d: "m119 79 9 32-34 24-28-28Z", x: -91, y: 6, tone: "c" },
  { d: "m165 112 48 23-24 31-42-19Z", x: 85, y: 5, tone: "a" },
  { d: "m94 135 34-24 10 35-39 27-34-34Z", x: -73, y: 61, tone: "b" },
  { d: "m128 111 37 1 7 35-34-1Z", x: -12, y: -92, tone: "c" },
  { d: "m136 146 34 1 19 19-38 21-52-14Z", x: 84, y: 79, tone: "b" },
  { d: "m99 173 39-27 15 41-30 29-31-17Z", x: -90, y: 73, tone: "a" },
  { d: "m189 166 24-31 16 32-20 41-20-27Z", x: 95, y: 34, tone: "c" },
  { d: "m123 216 30-29 38-21 18 42-42 28Z", x: 22, y: 91, tone: "a" },
  { d: "m67 139 32 34-7 26-25-15-9-26Z", x: -106, y: 22, tone: "c" },
  { d: "m229 167 19-14-3 38-18 27-10-10Z", x: 112, y: -28, tone: "b" },
];

const buildFragments = [
  { type: "nav", label: "navigation", x: -108, y: -74, dockX: -72, dockY: -44 },
  { type: "card", label: "content card", x: 112, y: -93, dockX: 70, dockY: -44 },
  { type: "button", label: "action button", x: -118, y: 88, dockX: -72, dockY: 56 },
  { type: "glyph", label: "markup glyph", text: "</>", x: 124, y: 72, dockX: 67, dockY: 58 },
  { type: "glyph", label: "code glyph", text: "{ }", x: 13, y: -126, dockX: 3, dockY: -91 },
];

function BuildComposition({ compact }) {
  const panels = compact ? buildPanels.filter((_, index) => index % 2 === 0) : buildPanels;
  const fragments = compact ? buildFragments.slice(0, 3) : buildFragments;

  return (
    <div className={`build-composition${compact ? " is-compact" : ""}`} aria-hidden="true">
      <svg key="build-faceted-object" className="build-object" viewBox="0 0 300 300">
        <defs>
          <clipPath id="build-sphere-clip">
            <path d="m150 54 33 10 30 22 22 35 11 40-8 40-24 34-36 20-38 2-39-14-30-27-16-37-2-39 16-39 29-30Z" />
          </clipPath>
        </defs>
        <circle className="build-progress-track" cx="150" cy="150" r="125" />
        <circle className="build-progress-ring" cx="150" cy="150" r="125" />
        <g className="build-wireframe">
          <path d="m150 54 33 10 30 22 22 35 11 40-8 40-24 34-36 20-38 2-39-14-30-27-16-37-2-39 16-39 29-30Z" />
          <path d="M68 122 150 96l85 25m-167 19 83-44 84 44m-161 37 77-37 82 37m-155 0 73 45 78-45m-139 25 61 20 64-20M150 54l-22 57 8 35-13 70m60-152-15 48 7 35 15 21m-90-76 33 54 45 22 38 17m-96-93-8 39 23 41 30 34" />
        </g>
        <g className="build-panels" clipPath="url(#build-sphere-clip)">
          {panels.map((panel, index) => (
            <path
              key={panel.d}
              className={`build-panel build-panel--${panel.tone}`}
              d={panel.d}
              style={{
                "--panel-delay": `${index * 105}ms`,
                "--fly-x": `${panel.x}px`,
                "--fly-y": `${panel.y}px`,
              }}
            />
          ))}
        </g>
        <path
          className="build-sphere-edge"
          d="m150 54 33 10 30 22 22 35 11 40-8 40-24 34-36 20-38 2-39-14-30-27-16-37-2-39 16-39 29-30Z"
        />
      </svg>
      {fragments.map((fragment, index) => (
        <div
          key={fragment.label}
          className={`build-fragment build-fragment--${fragment.type}`}
          aria-label={fragment.label}
          style={{
            "--fragment-delay": `${index * 190 + 100}ms`,
            "--fragment-x": `${fragment.x}px`,
            "--fragment-y": `${fragment.y}px`,
            "--dock-x": `${fragment.dockX}px`,
            "--dock-y": `${fragment.dockY}px`,
          }}
        >
          {fragment.type === "nav" && <><i key="dot-1" /><i key="dot-2" /><i key="dot-3" /><b key="link-1" /><b key="link-2" /><b key="link-3" /></>}
          {fragment.type === "card" && <><i key="thumbnail" /><b key="line-1" /><b key="line-2" /></>}
          {fragment.type === "button" && <i key="button-label" />}
          {fragment.type === "glyph" && fragment.text}
        </div>
      ))}
    </div>
  );
}

export default function DarkHeroScene({ started = true }) {
  const container = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const [pointerHovered, setPointerHovered] = useState(false);
  const [captionFocused, setCaptionFocused] = useState(false);
  const interactionPaused = !started || pointerHovered || captionFocused;
  const getStaticMode = useCallback(() =>
    reduceMotion ||
    window.matchMedia("(max-width: 680px), (pointer: coarse)").matches ||
    !hasWebGL(), [reduceMotion]);
  const [staticMode, setStaticMode] = useState(getStaticMode);
  const { stage, progress, jumpTo, inView, tabVisible } = useStageLoop(container, interactionPaused);
  const themeTokens = getComputedStyle(document.documentElement);
  const colors = {
    violet: themeTokens.getPropertyValue("--accent-violet").trim(),
    cyan: themeTokens.getPropertyValue("--accent-cyan").trim(),
    pink: themeTokens.getPropertyValue("--accent-pink").trim(),
    lime: themeTokens.getPropertyValue("--accent-lime").trim(),
    amber: themeTokens.getPropertyValue("--accent-amber").trim(),
  };

  useEffect(() => {
    const checkMode = () => {
      setStaticMode(getStaticMode());
    };
    window.addEventListener("resize", checkMode);
    return () => window.removeEventListener("resize", checkMode);
  }, [getStaticMode]);

  useEffect(() => progress.on("change", (value) => {
    const nextWeights = getStageWeights(value);
    const element = container.current;
    if (!element) return;
    element.style.setProperty("--stage-accent", accentAt(value));
    ["design", "build", "refine"].forEach((name, index) => {
      element.style.setProperty(`--stage-${name}-weight`, String(nextWeights[index]));
    });
  }), [progress]);

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    target.current = {
      x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1)) * 0.7,
      y: Math.max(-1, Math.min(1, -(((event.clientY - bounds.top) / bounds.height) * 2 - 1))) * 0.7,
    };
  };

  const handleCaptionBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setCaptionFocused(false);
    }
  };
  const handlePointerEnter = (event) => {
    if (event.pointerType !== "touch") setPointerHovered(true);
  };
  const handlePointerLeave = (event) => {
    if (event.pointerType !== "touch") setPointerHovered(false);
  };

  return (
    <div
      ref={container}
      className={`dark-hero-scene${staticMode ? " is-static" : ""}${reduceMotion ? " is-motion-reduced" : ""}`}
      data-active-stage={stage}
      style={{
        "--stage-accent": accentAt(progress.get()),
        "--stage-design-weight": "1",
        "--stage-build-weight": "0",
        "--stage-refine-weight": "0",
      }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={staticMode ? undefined : handlePointerMove}
    >
      <div className="stage-visuals" aria-hidden="true">
        <div className="stage-visual stage-visual--design">
          <DesignBlueprint />
        </div>
        <div className="stage-visual stage-visual--build">
          <BuildComposition compact={staticMode} />
        </div>
        <div className="stage-visual stage-visual--refine">
          {inView && started && (staticMode ? (
            <StaticOrb />
          ) : (
            <CanvasErrorBoundary>
              <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 4.8], fov: 40 }}
                frameloop={started && inView && tabVisible ? "always" : "never"}
              >
                <SceneContents target={target} colors={colors} />
              </Canvas>
            </CanvasErrorBoundary>
          ))}
          <svg className="refine-finish" viewBox="0 0 300 300">
            <defs>
              <clipPath id="refine-sphere-clip">
                <circle cx="150" cy="150" r="103" />
              </clipPath>
              <linearGradient id="refine-shine-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.78" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle className="refine-pulse-ring" cx="150" cy="150" r="113" />
            <g className="refine-shine" clipPath="url(#refine-sphere-clip)">
              <path d="M26 232 127 35h42L68 232Z" fill="url(#refine-shine-gradient)" />
            </g>
            <g className="refine-sparkle refine-sparkle--one">
              <path d="M78 84v15m-7.5-7.5h15" />
            </g>
            <g className="refine-sparkle refine-sparkle--two">
              <path d="M226 161v12m-6-6h12" />
            </g>
            <g className="refine-sparkle refine-sparkle--three">
              <path d="M104 220v9m-4.5-4.5h9" />
            </g>
            <g className="refine-check">
              <circle cx="233" cy="79" r="17" />
              <path d="m225 79 5 5 11-12" />
            </g>
          </svg>
        </div>
      </div>
      <div
        className="scene-caption"
        onFocusCapture={() => setCaptionFocused(true)}
        onBlurCapture={handleCaptionBlur}
      >
        {[["DESIGN", 1], ["BUILD", 2], ["REFINE", 3]].map(([label, stageIndex], index) => (
          <Fragment key={stageIndex}>
            <button
              type="button"
              className={`scene-stage-button${stage === stageIndex ? " is-active" : ""}`}
              aria-pressed={stage === stageIndex}
              onClick={() => jumpTo(stageIndex)}
            >
              <StageIcon stage={stageIndex} />
              <span>{label}</span>
            </button>
            {index < 2 && <span className="scene-stage-separator" aria-hidden="true">·</span>}
          </Fragment>
        ))}
      </div>
      <span className="visually-hidden" aria-live="polite" aria-atomic="true">
        Stage {stage} of 3: {["Design", "Build", "Refine"][stage - 1]}
      </span>
    </div>
  );
}
