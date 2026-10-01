// Renders the project archive from the data model.
// The first screen is the primary project preview; every screen remains available in the lightbox.
function renderProjectCard(project) {
  const stack = project.stack.map((item) => `<li>${item}</li>`).join('');
  const preview = project.images[0];
  const liveSite = project.liveUrl
    ? `<a class="project-live mono" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Live site <b aria-hidden="true">↗</b></a>`
    : '';

  return `
    <article class="project-card reveal">
      <div class="project-head">
        <p class="mono">${project.index} / ${project.category}</p>
        <p class="mono">${project.period}</p>
      </div>
      <button class="project-image gallery-thumb" type="button" data-project="${project.slug}" data-index="0" aria-label="View ${project.title} screenshots">
        <img src="projects/${project.slug}/${preview.file}" alt="${project.title} — ${preview.label}" loading="lazy">
        <span class="view-project mono">View ${project.images.length} screens <b>↗</b></span>
      </button>
      <div class="project-body">
        <div><h3>${project.title}</h3><p>${project.description}</p>${liveSite}</div>
        <ul class="project-stack mono">${stack}</ul>
      </div>
    </article>`;
}

function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (container) container.innerHTML = projectsData.map(renderProjectCard).join('');
}

renderProjects();
