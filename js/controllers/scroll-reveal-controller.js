// CONTROLLER: fades/slides elements with the .reveal class into view as they scroll into the viewport.
const scrollRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(elm => scrollRevealObserver.observe(elm));
