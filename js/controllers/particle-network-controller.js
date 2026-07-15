// CONTROLLER: interactive particle-network background (dots connected by lines when close
// to each other, classic "particles.js"-style effect) rendered on a single canvas spanning
// from the top of the hero (#top) to the bottom of #contact. Built with plain Canvas 2D - no
// external library - to stay consistent with the rest of the site being dependency-free and
// offline capable. The mouse acts like an extra particle: nearby dots draw a line to the
// cursor and drift slightly toward it, so the background reacts to the visitor without
// blocking clicks on the actual page content (canvas has pointer-events: none, except for
// the click-to-burst listener added directly on the canvas; see css/style.css).
//
// Extra behaviors layered on top of the base network:
// - Color shifts (blue -> cyan -> violet) based on which section is in view while scrolling.
// - Particles near a .attracts-particles element (project/skill cards) gently gravitate
//   toward that element's edge while it's hovered, visually tying the background to content.
// - Clicking anywhere in the tracked region spawns a burst of new particles at the click
//   point that fly outward and settle back into the normal drifting behavior.

(function particleNetworkController() {
  const host = document.getElementById('particle-network');
  const startSection = document.getElementById('top');
  const endSection = document.getElementById('contact');
  if (!host || !startSection || !endSection) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return; // respect user preference - skip the animated background entirely

  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Hue stops (as [r,g,b]) the network cycles through based on scroll position within
  // the tracked sections - signal blue -> cyan -> violet, then back down on the way out.
  const COLOR_STOPS = [
    [61, 92, 255],   // signal blue
    [56, 189, 248],  // cyan
    [167, 92, 255],  // violet
  ];
  let currentColor = COLOR_STOPS[0];

  const LINK_DISTANCE = 130;
  const MOUSE_LINK_DISTANCE = 170;
  const CARD_ATTRACT_DISTANCE = 220;
  const DENSITY = 1 / 9000; // particles per px^2 of layer area
  const MAX_PARTICLES = 140;

  let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let hoveredCardRect = null; // { left, top, right, bottom } in layer-local coords, or null

  function sizeLayer() {
    const startTop = startSection.offsetTop;
    const endBottom = endSection.offsetTop + endSection.offsetHeight;
    host.style.top = `${startTop}px`;
    const cssHeight = endBottom - startTop;
    host.style.height = `${cssHeight}px`;

    width = host.clientWidth;
    height = cssHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    seedParticles();
  }

  function seedParticles() {
    const target = Math.min(MAX_PARTICLES, Math.round(width * height * DENSITY));
    particles = Array.from({ length: target }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.4 + Math.random() * 1.4,
    }));
  }

  window.addEventListener('mousemove', (e) => {
    const rect = host.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = e.clientY >= rect.top && e.clientY <= rect.bottom;
  });
  window.addEventListener('mouseleave', () => { mouse.active = false; });

  // ---- Click-to-burst ----
  // Listens on window (the canvas itself is pointer-events: none so it never blocks real
  // page clicks) and spawns a small burst of extra particles at the click point whenever
  // the click lands within the tracked region. Burst particles fly outward briefly, then
  // their velocity decays back into the normal ambient drift range automatically via the
  // existing max-speed clamp in step().
  const BURST_COUNT = 14;
  const BURST_MAX_PARTICLES = MAX_PARTICLES + 60; // hard ceiling so rapid clicking can't runaway
  window.addEventListener('click', (e) => {
    const rect = host.getBoundingClientRect();
    if (e.clientY < rect.top || e.clientY > rect.bottom) return;
    if (e.target.closest('a, button, input, textarea, select, .gallery-thumb, .shot-card')) return;

    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    for (let i = 0; i < BURST_COUNT && particles.length < BURST_MAX_PARTICLES; i++) {
      const angle = (Math.PI * 2 * i) / BURST_COUNT + Math.random() * 0.3;
      const speed = 1.4 + Math.random() * 1.6;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1.2 + Math.random() * 1.6,
        burstDecay: 0.92, // extra per-frame slowdown just for burst particles, see step()
      });
    }
    // trim oldest ambient particles if we're over budget, keeping the newest burst intact
    if (particles.length > BURST_MAX_PARTICLES) {
      particles.splice(0, particles.length - BURST_MAX_PARTICLES);
    }
  });

  // ---- Scroll-based color shift ----
  // Maps how far the viewport center has progressed through the tracked region (0 -> 1)
  // to a position along COLOR_STOPS, interpolating smoothly between adjacent stops.
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mixColor(c1, c2, t) {
    return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
  }
  function updateColorFromScroll() {
    const rect = host.getBoundingClientRect();
    const total = rect.height + window.innerHeight;
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));

    const segments = COLOR_STOPS.length - 1;
    const scaled = progress * segments;
    const idx = Math.min(segments - 1, Math.floor(scaled));
    const t = scaled - idx;
    currentColor = mixColor(COLOR_STOPS[idx], COLOR_STOPS[idx + 1], t);
  }
  window.addEventListener('scroll', updateColorFromScroll, { passive: true });

  // ---- Card attraction ----
  // Any element with .attracts-particles reports its bounding box (in layer-local
  // coordinates) on hover, so nearby particles can drift toward its nearest edge.
  function registerAttractors() {
    const els = document.querySelectorAll('.attracts-particles, .terminal-card, .editor-card');
    els.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const r = el.getBoundingClientRect();
        const hostRect = host.getBoundingClientRect();
        hoveredCardRect = {
          left: r.left - hostRect.left,
          top: r.top - hostRect.top,
          right: r.right - hostRect.left,
          bottom: r.bottom - hostRect.top,
        };
      });
      el.addEventListener('mouseleave', () => { hoveredCardRect = null; });
    });
  }

  // Closest point on a rect's boundary to (x, y) - used so particles gravitate toward a
  // hovered card's nearest edge rather than its center, which looks more like attraction
  // to the card's surface than being sucked into a single point.
  function closestEdgePoint(rect, x, y) {
    const cx = Math.min(Math.max(x, rect.left), rect.right);
    const cy = Math.min(Math.max(y, rect.top), rect.bottom);
    // if the point is inside the rect, clamp pulls it to the nearest edge automatically
    // only when x/y is outside; if inside, push it to the nearest edge explicitly
    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
      const distLeft = x - rect.left, distRight = rect.right - x;
      const distTop = y - rect.top, distBottom = rect.bottom - y;
      const minDist = Math.min(distLeft, distRight, distTop, distBottom);
      if (minDist === distLeft) return { x: rect.left, y };
      if (minDist === distRight) return { x: rect.right, y };
      if (minDist === distTop) return { x, y: rect.top };
      return { x, y: rect.bottom };
    }
    return { x: cx, y: cy };
  }

  function step() {
    particles.forEach((p) => {
      // drift
      p.x += p.vx;
      p.y += p.vy;

      // gentle pull toward the cursor when nearby, so the network visibly reacts to it
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_LINK_DISTANCE && dist > 0.001) {
          p.vx += (dx / dist) * 0.0025;
          p.vy += (dy / dist) * 0.0025;
        }
      }

      // gravitate toward the nearest edge of a hovered card, tying the background to content
      if (hoveredCardRect) {
        const target = closestEdgePoint(hoveredCardRect, p.x, p.y);
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CARD_ATTRACT_DISTANCE && dist > 0.001) {
          const pull = (1 - dist / CARD_ATTRACT_DISTANCE) * 0.012;
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
        }
      }

      // burst particles carry extra per-frame decay until their speed settles back into
      // the normal ambient range, giving the "fly outward, then drift" burst feel
      if (p.burstDecay) {
        p.vx *= p.burstDecay;
        p.vy *= p.burstDecay;
      }

      // clamp drift speed so particles don't accelerate indefinitely
      const speed = Math.hypot(p.vx, p.vy);
      const maxSpeed = 0.6;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      } else if (p.burstDecay && speed < maxSpeed * 0.9) {
        delete p.burstDecay; // settled into ambient range, stop extra decay
      }

      // wrap around edges instead of bouncing, keeps the field feeling continuous
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const [r, g, b] = currentColor;
    const lineColor = (alpha) => `rgba(${r}, ${g}, ${b}, ${alpha})`;
    const dotColor = 'rgba(245, 245, 242, 0.55)';

    // connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b2 = particles[j];
        const dx = a.x - b2.x, dy = a.y - b2.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DISTANCE) {
          ctx.strokeStyle = lineColor((1 - dist / LINK_DISTANCE) * 0.35);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b2.x, b2.y);
          ctx.stroke();
        }
      }
    }

    // lines from cursor to nearby particles
    if (mouse.active) {
      particles.forEach((p) => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_LINK_DISTANCE) {
          ctx.strokeStyle = lineColor((1 - dist / MOUSE_LINK_DISTANCE) * 0.6);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });
    }

    // dots on top of the lines
    particles.forEach((p) => {
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animate() {
    step();
    draw();
    requestAnimationFrame(animate);
  }

  sizeLayer();
  registerAttractors();
  updateColorFromScroll();
  window.addEventListener('resize', sizeLayer);
  window.addEventListener('load', sizeLayer);
  setTimeout(sizeLayer, 800); // recompute after images/fonts settle final section heights

  animate();
})();
