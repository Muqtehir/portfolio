import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { portfolio } from '../../data/portfolio';
import { IntroPhaseContext } from './IntroPhaseContext';
import IntroOverlay from './IntroOverlay';
import { decideIntroMode } from './decideIntroMode';
import './intro.css';

const FALLBACK_NAME = 'Muqtehir Mayaleeke';
const FALLBACK_ROLE = 'Full-Stack Developer';

export default function IntroProvider({ children }) {
  const [mode] = useState(decideIntroMode);
  const [phase, setPhase] = useState(mode === 'off' ? 'done' : 'playing');
  const [announcement, setAnnouncement] = useState('Intro animation playing. Press Escape to skip.');
  const readyRef = useRef(false);
  const restorePageRef = useRef(() => {});
  const introRoot = typeof document === 'undefined'
    ? null
    : document.getElementById('intro-root');

  const restorePage = useCallback(() => {
    restorePageRef.current();
  }, []);

  useLayoutEffect(() => {
    if (mode === 'off') {
      document.documentElement.removeAttribute('data-intro');
      return undefined;
    }

    const pageRoot = document.getElementById('root');
    const documentElement = document.documentElement;
    const previousOverflow = documentElement.style.overflow;
    const previousScrollbarGutter = documentElement.style.scrollbarGutter;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const hadInert = pageRoot?.hasAttribute('inert') ?? false;
    const previousAriaHidden = pageRoot?.getAttribute('aria-hidden');
    let restored = false;

    const restore = () => {
      if (restored) return;
      restored = true;
      documentElement.style.overflow = previousOverflow;
      documentElement.style.scrollbarGutter = previousScrollbarGutter;
      documentElement.removeAttribute('data-intro');
      if (pageRoot) {
        if (!hadInert) pageRoot.removeAttribute('inert');
        if (previousAriaHidden === null) pageRoot.removeAttribute('aria-hidden');
        else pageRoot.setAttribute('aria-hidden', previousAriaHidden);
      }
    };

    restorePageRef.current = restore;
    documentElement.removeAttribute('data-intro');
    if (pageRoot) {
      pageRoot.setAttribute('inert', '');
      pageRoot.setAttribute('aria-hidden', 'true');
    }
    if (scrollbarWidth > 0) documentElement.style.scrollbarGutter = 'stable';
    documentElement.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    return () => {
      restore();
      if (restorePageRef.current === restore) restorePageRef.current = () => {};
    };
  }, [mode]);

  useEffect(() => {
    if (mode === 'off') return undefined;

    let fontsReady = !document.fonts;
    let windowLoaded = document.readyState === 'complete';
    let active = true;
    let timeoutId;

    const markReady = () => {
      if (active && fontsReady && windowLoaded) {
        readyRef.current = true;
        window.clearTimeout(timeoutId);
      }
    };
    const onLoad = () => {
      windowLoaded = true;
      markReady();
    };

    window.addEventListener('load', onLoad);
    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady = true;
        markReady();
      });
    }
    timeoutId = window.setTimeout(() => {
      readyRef.current = true;
    }, 6500);
    markReady();

    return () => {
      active = false;
      readyRef.current = false;
      window.removeEventListener('load', onLoad);
      window.clearTimeout(timeoutId);
    };
  }, [mode]);

  const onReveal = useCallback(() => {
    setPhase('revealing');
    window.dispatchEvent(new CustomEvent('intro:reveal'));
  }, []);

  const onDone = useCallback(() => {
    setPhase('done');
    try {
      sessionStorage.setItem('introSeen', '1');
    } catch {
      // Storage may be unavailable; the intro still completes for this page load.
    }
    restorePage();
    const focusTarget = document.querySelector('main, #main, h1');
    if (focusTarget) {
      const addedTabIndex = !focusTarget.hasAttribute('tabindex');
      if (addedTabIndex) focusTarget.setAttribute('tabindex', '-1');
      focusTarget.setAttribute('data-intro-focus', 'true');
      const clearIntroFocus = () => {
        focusTarget.removeAttribute('data-intro-focus');
        if (addedTabIndex) focusTarget.removeAttribute('tabindex');
        focusTarget.removeEventListener('blur', clearIntroFocus);
        window.removeEventListener('pointerdown', clearIntroFocus);
      };
      focusTarget.addEventListener('blur', clearIntroFocus, { once: true });
      window.addEventListener('pointerdown', clearIntroFocus, { once: true });
      focusTarget.focus({ preventScroll: true });
    }
    window.dispatchEvent(new CustomEvent('intro:done'));
    setAnnouncement('Intro finished.');
  }, [restorePage]);

  const isReady = useCallback(() => readyRef.current, []);
  const value = {
    phase,
    started: phase !== 'playing',
    done: phase === 'done',
  };

  return (
    <IntroPhaseContext.Provider value={value}>
      {children}
      {mode !== 'off' && introRoot
        ? createPortal(
            <>
              {phase !== 'done' && (
                <IntroOverlay
                  simple={mode === 'simple'}
                  name={portfolio.name || FALLBACK_NAME}
                  role={portfolio.experience?.[0]?.title || FALLBACK_ROLE}
                  isReady={isReady}
                  onReveal={onReveal}
                  onDone={onDone}
                />
              )}
              <div role="status" className="sr-only" aria-live="polite">
                {announcement}
              </div>
            </>,
            introRoot,
          )
        : null}
    </IntroPhaseContext.Provider>
  );
}
