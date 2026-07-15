// CONTROLLER: lightbox behavior for project screenshots. Lets visitors click any
// thumbnail rendered by js/views/projects-view.js to see the full-size screenshot,
// with next/prev navigation through that project's image set and keyboard/backdrop
// dismissal. Depends on projectsData (js/models/projects-data.js).

(function galleryController() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  if (!lightbox || !lightboxImg) return;

  let currentProject = null;
  let currentIndex = 0;

  function findProject(slug) {
    return projectsData.find(p => p.slug === slug);
  }

  function show(slug, index) {
    const project = findProject(slug);
    if (!project) return;
    currentProject = project;
    currentIndex = (index + project.images.length) % project.images.length;
    const img = project.images[currentIndex];
    lightboxImg.src = `projects/${project.slug}/${img.file}`;
    lightboxImg.alt = `${project.title} - ${img.label}`;
    lightboxCaption.textContent = `${project.title} - ${img.label} (${currentIndex + 1}/${project.images.length})`;
    lightbox.classList.remove('hidden-lightbox');
    lightbox.classList.remove('hidden');
  }

  function hide() {
    lightbox.classList.add('hidden-lightbox');
    setTimeout(() => lightbox.classList.add('hidden'), 200);
  }

  function step(delta) {
    if (!currentProject) return;
    show(currentProject.slug, currentIndex + delta);
  }

  // Event delegation: thumbnails are rendered dynamically, so listen on the document.
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.gallery-thumb');
    if (thumb) {
      show(thumb.dataset.project, Number(thumb.dataset.index));
      return;
    }
    if (e.target === lightbox) hide();
  });

  closeBtn?.addEventListener('click', hide);
  prevBtn?.addEventListener('click', () => step(-1));
  nextBtn?.addEventListener('click', () => step(1));

  window.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
