import { useEffect, useRef } from 'react';
import { createIntroEngine } from './introEngine';

export default function IntroOverlay({ simple, name, role, isReady, onReveal, onDone }) {
  const cb = useRef({ isReady, onReveal, onDone });

  useEffect(() => {
    cb.current = { isReady, onReveal, onDone };
  });

  useEffect(() => {
    const engine = createIntroEngine({
      simple,
      isReady: () => cb.current.isReady(),
      onReveal: () => cb.current.onReveal(),
      onDone: () => cb.current.onDone(),
    });
    const onKey = (event) => {
      if (event.key === 'Escape') engine.skip();
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      engine.destroy();
    };
  }, [simple]);

  return (
    <>
      <div id="im-overlay" role="presentation">
        <div id="im-wrap">
          <svg id="im-svg" viewBox="-60 -20 520 440" role="img" aria-label="Animated letter M logo">
            <defs id="im-defs">
              <linearGradient id="im-g" gradientUnits="userSpaceOnUse" x1="50" y1="80" x2="350" y2="320">
                <stop offset="0" stopColor="#8B5CF6" />
                <stop offset=".55" stopColor="#F472B6" />
                <stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
              <linearGradient id="im-hl" gradientUnits="userSpaceOnUse" x1="120" y1="80" x2="200" y2="250">
                <stop offset="0" stopColor="#fff" stopOpacity=".42" />
                <stop offset=".6" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="im-sh">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset=".5" stopColor="#fff" stopOpacity=".8" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="im-hg">
                <stop offset="0" stopColor="#8B5CF6" stopOpacity=".55" />
                <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
              </radialGradient>
              <pattern id="im-gp" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="#22D3EE" strokeOpacity=".11" />
              </pattern>
              <polygon id="im-mp" points="50,320 50,80 118,80 200,222 282,80 350,80 350,320 292,320 292,160.7 200,320 108,160.7 108,320" />
              <g id="im-mg">
                <use href="#im-mp" fill="url(#im-g)" />
                <use href="#im-mp" fill="url(#im-hl)" />
              </g>
              <clipPath id="im-mc"><use href="#im-mp" /></clipPath>
              <clipPath id="im-wipe"><rect id="im-wr" x="30" y="60" width="0" height="280" /></clipPath>
            </defs>
            <rect id="im-grid" x="-60" y="-20" width="520" height="440" fill="url(#im-gp)" opacity="0" />
            <circle id="im-halo" cx="200" cy="200" r="230" fill="url(#im-hg)" opacity="0" />
            <g id="im-guides" />
            <g clipPath="url(#im-wipe)"><use id="im-base" href="#im-mg" /></g>
            <g id="im-frags" />
            <polygon
              id="im-ol"
              points="50,320 50,80 118,80 200,222 282,80 350,80 350,320 292,320 292,160.7 200,320 108,160.7 108,320"
              fill="none"
              stroke="url(#im-g)"
              strokeWidth="2"
              strokeLinejoin="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
            />
            <g clipPath="url(#im-mc)">
              <rect id="im-shine" x="-60" y="40" width="70" height="320" fill="url(#im-sh)" opacity="0" transform="rotate(16 200 200)" />
            </g>
            <circle id="im-ring" cx="200" cy="200" r="20" fill="none" stroke="url(#im-g)" strokeWidth="3" opacity="0" />
          </svg>
          <div id="im-wm">
            <b id="im-wm-b">{name}</b>
            <span id="im-wm-s">{role}</span>
          </div>
        </div>
      </div>
      <svg id="im-iris-svg" aria-hidden="true">
        <defs>
          <linearGradient id="im-ig" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8B5CF6" />
            <stop offset=".55" stopColor="#F472B6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <circle id="im-iris-g" cx="50%" cy="50%" r="0" fill="none" stroke="url(#im-ig)" strokeWidth="16" opacity="0" />
        <circle id="im-iris-c" cx="50%" cy="50%" r="0" fill="none" stroke="url(#im-ig)" strokeWidth="3" opacity="0" />
      </svg>
    </>
  );
}
