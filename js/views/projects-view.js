// VIEW: renders the Projects section markup from js/models/projects-data.js.
// Keeps portfolio.html free of repeated per-project markup - add/edit projects by
// editing the data model only.
//
// Each card is wrapped for a 3D tilt effect (see js/controllers/tilt-controller.js) and
// shows a handful of screenshots as an overlapping "fanned" stack instead of a flat grid
// - clicking any screenshot opens the full lightbox gallery for that project.

const MAX_STACK_PREVIEW = 4;

function renderProjectCard(project) {
  const stackChips = project.stack
    .map(s => `<span class="border border-soft rounded-full px-3 py-1 text-paper/50">${s}</span>`)
    .join('');

  const previewImages = project.images.slice(0, MAX_STACK_PREVIEW);
  const shotCards = previewImages
    .map((img, i) => `
      <img
        src="projects/${project.slug}/${img.file}"
        alt="${project.title} - ${img.label}"
        loading="lazy"
        style="--i: ${i}"
        class="shot-card gallery-thumb"
        data-project="${project.slug}"
        data-index="${i}"
      />
    `)
    .join('');

  return `
    <div class="project-card attracts-particles reveal">
      <div class="tilt-card-inner border rounded-2xl p-8">
        <div class="tilt-glare"></div>
        <div class="flex items-center justify-between gap-3 mb-4">
          <p class="font-mono text-xs text-paper/40">${project.index} / ${project.category}</p>
          <span class="period-chip">${project.period}</span>
        </div>
        <h3 class="font-display text-xl font-semibold mb-3">${project.title}</h3>
        <p class="text-paper/65 leading-relaxed text-sm">${project.description}</p>
        <div class="mt-6 flex flex-wrap gap-2 font-mono text-[11px]">${stackChips}</div>

        <div class="shot-stack mt-8">
          ${shotCards}
          <span class="shot-count-badge">${project.images.length} screenshots</span>
        </div>
      </div>
    </div>
  `;
}

function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;
  container.innerHTML = projectsData.map(renderProjectCard).join('');
}

renderProjects();
