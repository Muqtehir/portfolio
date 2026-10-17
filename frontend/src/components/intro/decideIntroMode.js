let lastLoggedMode;

const withModeLog = (mode) => {
  if (import.meta.env.DEV && lastLoggedMode !== mode) {
    console.info(`[intro] mode: ${mode}`);
    lastLoggedMode = mode;
  }
  return mode;
};

export function decideIntroMode() {
  if (typeof window === 'undefined') return withModeLog('off');
  if (import.meta.env.DEV) {
    const q = new URLSearchParams(window.location.search).get('intro');
    if (q === 'full' || q === 'simple' || q === 'off') return withModeLog(q);
  }
  try {
    if (sessionStorage.getItem('introSeen')) return withModeLog('off');
  } catch {
    // Storage may be unavailable; continue with the remaining mode checks.
  }
  const deepLink = window.location.hash.length > 1 || window.location.pathname !== import.meta.env.BASE_URL;
  if (deepLink) return withModeLog('off');
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rd = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const weak = coarse && ((navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
  return withModeLog(rm || rd || weak ? 'simple' : 'full');
}
