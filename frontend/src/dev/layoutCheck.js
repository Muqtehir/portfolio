export function installLayoutCheck() {
  if (!import.meta.env.DEV) return;
  window.__layoutCheck = () => {
    const out = [], vw = document.documentElement.clientWidth;
    const sel = (e) => (e.id ? '#' + e.id : e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''));
    if (document.documentElement.scrollWidth > vw + 1) out.push(`PAGE scrolls sideways: ${document.documentElement.scrollWidth} > ${vw}`);
    document.querySelectorAll('body *').forEach((el) => {
      if (el.closest('#im-overlay, #im-iris-svg, svg')) return;
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0 || r.height === 0) return;
      if (r.right > vw + 1 || r.left < -1) out.push(`OFFSCREEN ${sel(el)} ${Math.round(r.left)}..${Math.round(r.right)}`);
      const onlyWbr = [...el.children].every((c) => c.tagName === 'WBR');
      if (onlyWbr && el.textContent.trim()) {
        const words = el.textContent.trim().split(/\s+/);
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
        const lines = Math.round(r.height / lh);
        const allowed = el.querySelector('wbr') ? 2 : 1;
        if (words.length === 1 && words[0].length > 6 && lines > allowed) out.push(`WORD BROKEN over ${lines} lines: "${words[0]}" in ${sel(el)}`);
        if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== 'visible') out.push(`TEXT CLIPPED ${sel(el)}`);
      }
    });
    return out.length ? out : 'OK: no overflow or broken words';
  };
}
