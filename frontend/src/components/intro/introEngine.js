const NS = 'http://www.w3.org/2000/svg';
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (T, a, b) => cl((T - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eo = (t) => 1 - Math.pow(1 - t, 3);
const eb = (t) => { const c = 1.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const mk = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
};
const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// The M: bold stems, 60-degree diagonals. Centre is (200,200).
const M = [[50,320],[50,80],[118,80],[200,222],[282,80],[350,80],[350,320],[292,320],[292,160.7],[200,320],[108,160.7],[108,320]];
const inM = (x, y) => {
  let c = false;
  for (let i = 0, j = M.length - 1; i < M.length; j = i++) {
    const [a, b] = M[i], [p, q] = M[j];
    if ((b > y) !== (q > y) && x < ((p - a) * (y - b)) / (q - b) + a) c = !c;
  }
  return c;
};

export function createIntroEngine({ simple = false, isReady = () => true, onReveal, onDone }) {
  const $ = (id) => document.getElementById(id);
  const overlay = $('im-overlay'), wrap = $('im-wrap'), wmB = $('im-wm-b'), wmS = $('im-wm-s');
  const ring = $('im-ring'), shine = $('im-shine'), base = $('im-base'), ol = $('im-ol'), wr = $('im-wr');
  const halo = $('im-halo'), grid = $('im-grid'), frags = $('im-frags'), guides = $('im-guides'), defs = $('im-defs');
  const irisC = $('im-iris-c'), irisG = $('im-iris-g');
  const REV = simple ? 1.5 : 3.15, END = simple ? 2 : 3.8;
  let T = 0, last = performance.now(), raf = 0, revealed = false, finished = false, destroyed = false, forced = false;
  const created = [];
  let FR = [], GL = [];

  if (!simple) {
    // Shatter lines follow the same 60-degree geometry as the diagonals.
    const A = 100, H = A * 0.866, tris = [];
    for (let r = 0; r < 3; r++) {
      const yt = 80 + r * H, yb = yt + H, x0 = -(r % 2) * A / 2;
      for (let c = 0; c < 5; c++) {
        const x = x0 + c * A;
        tris.push([[x, yb], [x + A, yb], [x + A / 2, yt]]);
        tris.push([[x + A / 2, yt], [x + A * 1.5, yt], [x + A, yb]]);
      }
    }
    const keep = tris.filter((t) => {
      let n = 0;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4 - i; j++) {
        const u = 0.12 + i * 0.22, v = 0.12 + j * 0.22, w = 1 - u - v;
        if (inM(t[0][0] * u + t[1][0] * v + t[2][0] * w, t[0][1] * u + t[1][1] * v + t[2][1] * w)) n++;
      }
      return n >= 2;
    });
    const rnd = mulberry32(11);
    FR = keep.map((t, k) => {
      const pts = t.map((p) => p.join(',')).join(' ');
      const c = [(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3];
      const cp = mk('clipPath', { id: 'im-t' + k }, defs); created.push(cp); mk('polygon', { points: pts }, cp);
      const g = mk('g', {}, frags), a = mk('g', { 'clip-path': `url(#im-t${k})` }, g);
      mk('use', { href: '#im-mg' }, a);
      const b = mk('g', { 'clip-path': 'url(#im-mc)' }, g);
      const ed = mk('polygon', { points: pts, fill: '#fff', 'fill-opacity': 0, stroke: '#fff', 'stroke-width': 1.2, 'stroke-opacity': 0 }, b);
      const dx = c[0] - 200, dy = c[1] - 200, L = Math.hypot(dx, dy) || 1, nd = cl(L / 190);
      const dist = (35 + rnd() * 55) * (0.6 + nd);
      return {
        g, ed, c,
        dx: (dx / L) * dist, dy: (dy / L) * dist - rnd() * 25,
        rot: (rnd() < 0.5 ? -1 : 1) * (8 + rnd() * 14),
        sc: 1.03 + rnd() * 0.09,
        xd: nd * 0.12, rd: (1 - nd) * 0.18 + rnd() * 0.05,
        fa: rnd() * 0.14,
      };
    });
    [[10,80,390,80],[10,320,390,320],[50,36,50,364],[350,36,350,364],[200,36,200,364],[94.9,40,268.1,340],[305.1,40,131.9,340]].forEach((l) =>
      GL.push(mk('line', { x1: l[0], y1: l[1], x2: l[2], y2: l[3], stroke: '#22D3EE', 'stroke-width': 1, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, guides)));
  }

  function frame(T) {
    overlay.style.opacity = '1';
    grid.setAttribute('opacity', 0.9 * eo(seg(T, 0, 0.4)) * (1 - 0.7 * eo(seg(T, 2.5, 3))));
    const go = T < 0.85 ? 1 : 1 - eo(seg(T, 0.85, 1.15));
    GL.forEach((e, k) => {
      e.setAttribute('stroke-dashoffset', 1 - eo(seg(T, k * 0.03, 0.45 + k * 0.03)));
      e.setAttribute('stroke-opacity', 0.45 * go);
    });
    const dr = eo(seg(T, 0.05, 0.6)), fo = eo(seg(T, 0.45, 0.85));
    wr.setAttribute('width', 330 * fo);
    let mx = 0;
    FR.forEach((o) => {
      const E = eo(seg(T, 0.95 + o.xd, 1.5 + o.xd)), R = eb(seg(T, 1.75 + o.rd, 2.4 + o.rd));
      const f = E * (1 - R), af = Math.abs(f);
      mx = Math.max(mx, af);
      o.g.setAttribute('transform', `translate(${o.c[0] + o.dx * f} ${o.c[1] + o.dy * f}) rotate(${o.rot * f}) scale(${1 + (o.sc - 1) * f}) translate(${-o.c[0]} ${-o.c[1]})`);
      const v = cl(af * 2);
      o.ed.setAttribute('stroke-opacity', 0.55 * v);
      o.ed.setAttribute('fill-opacity', o.fa * v);
    });
    const whole = mx < 0.0008;
    base.setAttribute('opacity', whole ? 1 : 0);
    frags.setAttribute('visibility', whole ? 'hidden' : 'visible');
    const gh = cl(mx * 20);
    ol.setAttribute('stroke-dashoffset', 1 - dr);
    ol.setAttribute('stroke-opacity', (1 - 0.78 * fo) * (1 - gh) + 0.45 * gh);
    const rp = seg(T, 2.5, 3);
    ring.setAttribute('r', 20 + 190 * eo(rp));
    ring.setAttribute('opacity', rp > 0 && rp < 1 ? (1 - rp) * 0.8 : 0);
    ring.setAttribute('stroke-width', 3 - 2 * rp);
    const sp = seg(T, 2.6, 3.1);
    shine.setAttribute('x', lerp(-80, 420, eio(sp)));
    shine.setAttribute('opacity', sp > 0 && sp < 1 ? 1 : 0);
    halo.setAttribute('opacity', 0.55 * fo + 0.3 * Math.sin(Math.PI * seg(T, 2.45, 3.05)));
    const wp = eo(seg(T, 0.6, 1.1));
    wmB.style.opacity = wp;
    wmB.style.transform = `translateY(${(1 - wp) * 8}px)`;
    wmS.style.opacity = eo(seg(T, 0.8, 1.3));
    // Reveal: circular opening from the screen centre + glowing ring on its edge.
    const rv = eio(seg(T, REV, END)), R2 = rv * 150;
    const m = `radial-gradient(circle at 50% 50%, transparent ${R2}%, #000 ${R2 + 0.5}%)`;
    overlay.style.webkitMaskImage = overlay.style.maskImage = m;
    wrap.style.opacity = '1';
    const rr = (Math.hypot(window.innerWidth, window.innerHeight) / 2) * R2 / 100;
    const io = rv > 0 && rv < 1 ? 0.95 * (1 - seg(rv, 0.75, 1)) : 0;
    irisC.setAttribute('r', rr); irisG.setAttribute('r', rr);
    irisC.setAttribute('opacity', io); irisG.setAttribute('opacity', io * 0.4);
  }

  function simpleFrame(T) {
    GL.forEach((e) => e.setAttribute('stroke-opacity', 0));
    grid.setAttribute('opacity', 0); frags.setAttribute('visibility', 'hidden');
    ol.setAttribute('stroke-opacity', 0); ring.setAttribute('opacity', 0); shine.setAttribute('opacity', 0);
    wr.setAttribute('width', 330); base.setAttribute('opacity', 1);
    irisC.setAttribute('opacity', 0); irisG.setAttribute('opacity', 0);
    const a = eo(seg(T, 0, 0.5));
    wrap.style.opacity = a; halo.setAttribute('opacity', 0.45 * a);
    wmB.style.opacity = eo(seg(T, 0.3, 0.8)); wmB.style.transform = 'none'; wmS.style.opacity = eo(seg(T, 0.5, 1));
    overlay.style.webkitMaskImage = overlay.style.maskImage = 'none';
    overlay.style.opacity = 1 - eio(seg(T, REV, END));
  }

  const draw = simple ? simpleFrame : frame;
  function loop(now) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!document.hidden) {
      // Hold at the sealed M until fonts/page are ready (or Escape was pressed).
      if (!(T >= REV && !(forced || isReady()))) T = Math.min(END, T + dt);
      draw(T);
      if (T >= REV && !revealed) { revealed = true; onReveal && onReveal(); }
      if (T >= END && !finished) { finished = true; onDone && onDone(); return; }
    }
    raf = requestAnimationFrame(loop);
  }

  draw(0);
  raf = requestAnimationFrame(loop);

  return {
    skip() { forced = true; T = Math.max(T, REV); },
    destroy() {
      destroyed = true; cancelAnimationFrame(raf);
      created.forEach((n) => n.remove());
      frags.replaceChildren(); guides.replaceChildren();
    },
  };
}
