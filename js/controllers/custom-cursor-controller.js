// CONTROLLER: custom cursor - a small signal-blue dot that tracks the mouse exactly, plus
// a larger ring that trails slightly behind it for a soft "lag" feel. Grows and brightens
// over interactive elements (links, buttons, cards) so it also communicates hover state.
// Desktop-only: skipped on touch devices and when the user prefers reduced motion, and the
// real system cursor is hidden via CSS only when this script successfully initializes.

(function customCursorController() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouchDevice || reducedMotion) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.classList.add('custom-cursor-active');

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // ring lags behind the dot with simple easing, giving the trailing feel
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const HOVER_SELECTOR = 'a, button, .skill-tag, .gallery-thumb, .shot-card, .project-card, .terminal-card, .editor-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_SELECTOR)) document.body.classList.add('custom-cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_SELECTOR)) document.body.classList.remove('custom-cursor-hover');
  });

  document.addEventListener('mousedown', () => document.body.classList.add('custom-cursor-down'));
  document.addEventListener('mouseup', () => document.body.classList.remove('custom-cursor-down'));

  // hide entirely when the cursor leaves the window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();
