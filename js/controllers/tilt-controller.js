// CONTROLLER: 3D tilt-on-hover effect for project cards (the "premium portfolio" mouse-follow
// tilt seen on a lot of dev portfolio sites). Rotates each .tilt-card-inner based on cursor
// position within its parent .project-card, and moves a radial glare to match. Uses event
// delegation since cards are rendered dynamically by js/views/projects-view.js.

(function tiltController() {
  const MAX_TILT_DEG = 8;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  function handleMove(e) {
    const card = e.target.closest('.project-card');
    if (!card) return;
    const inner = card.querySelector('.tilt-card-inner');
    if (!inner) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0 -> 1 across the card
    const y = (e.clientY - rect.top) / rect.height;  // 0 -> 1 down the card

    const rotateY = (x - 0.5) * MAX_TILT_DEG * 2;
    const rotateX = (0.5 - y) * MAX_TILT_DEG * 2;

    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    inner.style.setProperty('--mx', `${x * 100}%`);
    inner.style.setProperty('--my', `${y * 100}%`);
  }

  function resetTilt(e) {
    const card = e.target.closest('.project-card');
    if (!card) return;
    const inner = card.querySelector('.tilt-card-inner');
    if (!inner) return;
    inner.style.transform = '';
  }

  document.addEventListener('mousemove', (e) => {
    if (e.target.closest('.project-card')) handleMove(e);
  });
  document.addEventListener('mouseleave', (e) => {
    if (e.target.closest && e.target.closest('.project-card')) resetTilt(e);
  }, true);

  // mouseleave on the card itself (delegation-safe reset when cursor exits a card entirely)
  document.addEventListener('pointerout', (e) => {
    const card = e.target.closest?.('.project-card');
    if (card && !card.contains(e.relatedTarget)) {
      const inner = card.querySelector('.tilt-card-inner');
      if (inner) inner.style.transform = '';
    }
  });
})();
