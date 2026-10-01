// GitHub-style year selector using the user's confirmed annual contribution totals.
const contributionGrid = document.getElementById('contribution-grid');
const contributionSummary = document.getElementById('contribution-summary');
const yearButtons = document.querySelectorAll('[data-year]');

function dense2026Activity() {
  const cells = new Map();
  const clusters = [
    [14, [2, 3]], [18, [0, 1, 2, 3, 4, 5, 6]], [19, [0, 1]],
    [25, [1, 4]], [28, [1, 4]], [31, [3, 5]], [34, [2, 4]],
    [36, [1, 3, 5, 6]], [37, [0, 1, 2, 3, 4, 5, 6]],
    [38, [0, 1, 2, 3, 4, 5]], [39, [0, 2, 3, 4]],
  ];

  clusters.forEach(([week, rows], clusterIndex) => {
    rows.forEach((row, rowIndex) => cells.set(week * 7 + row, (clusterIndex + rowIndex) % 4 + 1));
  });
  return [...cells];
}

const contributionYears = {
  2026: { total: 225, days: dense2026Activity() },
  2025: { total: 7, days: [[66, 3], [67, 2], [67 + 7, 1], [124, 4], [183, 2], [256, 3], [322, 1]] },
  2024: { total: 7, days: [[268, 2], [275, 4], [282, 3], [289, 1], [303, 4], [310, 2], [317, 3]] },
};

function renderContributionYear(year) {
  const data = contributionYears[year];
  if (!contributionGrid || !data) return;

  const activeDays = new Map(data.days);
  const cells = document.createDocumentFragment();

  for (let day = 0; day < 52 * 7; day += 1) {
    const cell = document.createElement('span');
    const level = activeDays.get(day);
    cell.className = `contribution-cell${level ? ` level-${level}` : ''}`;
    cells.appendChild(cell);
  }

  contributionGrid.replaceChildren(cells);
  contributionSummary.textContent = `${data.total} contributions in ${year}`;
  contributionGrid.parentElement.parentElement.setAttribute(
    'aria-label',
    `GitHub-style contribution graph showing ${data.total} contributions in ${year}`,
  );
}

yearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const year = button.dataset.year;
    yearButtons.forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    renderContributionYear(year);
  });
});

renderContributionYear('2026');
