// MODEL: tech-stack labels for the 3D hero background (see js/controllers/hero-scene-controller.js).
// Mirrors every tag shown in the ~/skills section (Languages & Frameworks, Front-End,
// Database, Tools & Platforms, Integrations, AI-Assisted Dev) so the hero always reflects
// the full stack. Rendered as plain text sprites instead of logo images - clearer to read
// at small sizes and avoids icon-detail loss when the sphere is rotating in the background.
// hero-scene-controller.js auto-shrinks label size and widens the sphere radius as this
// list grows, so items stay readable and don't overlap even with a large count.

const iconStack = [
  // Languages & Frameworks
  { label: 'PHP' },
  { label: 'Laravel' },
  { label: 'JavaScript (ES6+)' },
  { label: 'HTML5' },
  { label: 'CSS3' },
  { label: 'RESTful APIs' },
  // Front-End
  { label: 'Tailwind CSS' },
  { label: 'Bootstrap' },
  { label: 'Sass' },
  { label: 'Blade' },
  // Database
  { label: 'MySQL' },
  { label: 'MariaDB' },
  { label: 'phpMyAdmin' },
  { label: 'Eloquent ORM' },
  // Tools & Platforms
  { label: 'Git' },
  { label: 'GitHub' },
  { label: 'VS Code' },
  { label: 'XAMPP' },
  { label: 'Composer' },
  { label: 'Vite' },
  { label: 'Hostinger' },
  // Integrations
  { label: 'Google OAuth' },
  { label: 'PayMongo API' },
  { label: 'Chart.js' },
  { label: 'DomPDF' },
  { label: 'PHPWord' },
  // AI-Assisted Development
  { label: 'ChatGPT' },
  { label: 'Claude' },
];
