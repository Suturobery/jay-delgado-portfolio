# Dev Portfolio Template — Terminal / Code-Editor Theme

A single-page developer portfolio template built with **HTML5, Tailwind CSS, and vanilla JavaScript**, featuring a live 3D hero background, an interactive particle-network backdrop, tilt-on-hover project cards, and a terminal/code-editor visual language throughout. Fully self-contained — no build tools, no npm, no framework. Fork it, swap in your own content, and it runs.

Use this as a starting point if you want a portfolio that looks like a developer's terminal/IDE rather than a generic template site.

---

## 1. Overview

| | |
|---|---|
| **Entry point** | `portfolio.html` |
| **Structure** | Single HTML file + MVC-style CSS/JS organization |
| **Dependencies** | Loaded via CDN — Tailwind CSS, Google Fonts, Three.js |
| **Offline support** | Layout & content work offline; 3D hero, fonts, and CDN scripts need internet on first load |
| **Framework** | None — vanilla HTML5 / CSS3 / JavaScript (ES6+) |
| **License / reuse** | Template — copy the structure, replace the content with your own |

---

## 2. What's included

- **3D hero background** — rotating wireframe icosahedron (Three.js) with your tech stack rendered as floating text labels, ambient particle field, mouse-parallax camera
- **Interactive particle-network backdrop** — canvas-based "connect the dots" effect spanning hero → contact, with scroll-based color shift, cursor interaction, click-to-burst, and particles that gravitate toward hovered cards
- **Custom cursor** — signal-color dot + trailing ring, grows on hoverable elements (desktop only, respects reduced-motion)
- **3D tilt project cards** — cards rotate toward the cursor on hover with a light-glare effect
- **Fanned screenshot stack** — project screenshots shown as an overlapping "hand of cards" that spreads apart on hover, click-through to a full lightbox gallery
- **Terminal-style skill cards** — skill categories rendered as mini terminal windows (traffic-light dots, `$ ls` prompts)
- **Code-editor-style cards** — a second card style with a file tab and line-numbered body, for a distinct "artifact" look from the terminal cards
- **Typewriter hero tagline**, **scroll-reveal animations**, **mobile nav**, **glow-orb decorative backgrounds**, **fade-gradient section dividers**

Everything is theme-able from one color palette (see below) and every content section pulls from a small JS data file instead of being hardcoded into the HTML.

---

## 3. Design system

**Color palette** (edit in `js/tailwind-config.js`)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A0A0A` | Base background |
| `paper` | `#F5F5F2` | Primary text, soft off-white |
| `graphite` | `#141414` | Section surfaces, cards |
| `line` | `#2E2E2E` | Borders, dividers |
| `signal` | `#3D5CFF` | Links, hover states, CTAs, accent glow — change this one value to re-theme the whole site |

**Typography**

- **Space Grotesk** — display headings
- **Inter** — body copy
- **JetBrains Mono** — terminal-style labels (`~/skills`, `$ whoami`, file tabs)

**Visual theme**

Terminal/developer-tool aesthetic throughout — section paths as nav labels, mock shell commands, typewriter effects, terminal and code-editor card styles. Built to reinforce "I build with code" rather than using generic template decoration.

---

## 4. Page architecture

| Section | ID | Purpose |
|---|---|---|
| **Navigation** | — | Fixed header, terminal-style branding, section links, availability status |
| **Hero** | `#top` | 3D background, name, tagline, intro copy, CTA buttons |
| **About** | `#about` | Bio, profile picture, key stats |
| **Skills** | `#stack` | Skill categories as terminal-window cards |
| **Tech Stack Details** | `#tech-breakdown` | Deeper technical breakdown as code-editor-style cards |
| **Projects** | `#projects` | Project cards with tilt effect + fanned screenshot stacks |
| **Experience** | `#experience` | Timeline of work history / education |
| **Contact** | `#contact` | Email, social links |

Adjust, rename, remove, or duplicate any section — they're independent and don't depend on each other's markup.

---

## 5. File organization (MVC-style)

```
portfolio/
├── portfolio.html                        # Main entry point — markup only
├── favicon.svg                           # Site favicon (swap with your own)
├── css/
│   └── style.css                         # All custom styles (cards, glow orbs, cursor, particles)
├── js/
│   ├── tailwind-config.js                # Tailwind theme config — colors, fonts
│   ├── models/                           # Data — edit these to change content
│   │   ├── icons-data.js                 # Tech stack labels for the 3D hero
│   │   └── projects-data.js              # Project list: titles, dates, tech, screenshot refs
│   ├── views/                            # Render functions — turn data into DOM markup
│   │   └── projects-view.js              # Renders project cards from projects-data.js
│   └── controllers/                      # Behavior / interaction wiring
│       ├── hero-scene-controller.js      # Three.js 3D hero setup and animation loop
│       ├── particle-network-controller.js# Interactive particle-network backdrop
│       ├── custom-cursor-controller.js   # Custom cursor dot + trailing ring
│       ├── tilt-controller.js            # 3D tilt-on-hover for project cards
│       ├── nav-controller.js             # Mobile menu toggle
│       ├── typewriter-controller.js      # Hero tagline typewriter effect
│       ├── scroll-reveal-controller.js   # Fade-in on scroll (Intersection Observer)
│       └── gallery-controller.js         # Screenshot lightbox/gallery
└── projects/                             # Screenshot folders, one per project
    └── your-project-slug/
        ├── screenshot1.png
        └── screenshot2.png
```

**Script load order matters** (already set up correctly in `portfolio.html`):
1. `tailwind-config.js` (theme)
2. `models/*` (data)
3. `views/*` (render functions — depend on models)
4. `controllers/*` (behavior — some depend on views having rendered first)

---

## 6. Quick start

**View locally**
Double-click `portfolio.html` — opens in any modern browser. Needs internet on first load for Google Fonts, the Tailwind CDN script, and Three.js.

**Deploy for free**
- **GitHub Pages** — push the repo, enable Pages in settings
- **Netlify** — drag and drop the folder
- **Vercel** — same, direct upload
- **Cloudflare Pages** — direct file upload

**Add a custom domain**
Point your domain registrar to your host's nameservers, or add a CNAME record per your host's instructions.

---

## 7. Making it yours

This is a template — nothing in the markup is meant to stay as-is. Replace placeholder content in this order:

| Step | What to change | Where |
|---|---|---|
| 1 | Accent color / palette | `js/tailwind-config.js` → `colors` |
| 2 | Your name, tagline, hero copy | `portfolio.html` → `<section id="top">` |
| 3 | About bio, stats, profile photo | `portfolio.html` → `<section id="about">` |
| 4 | Tech stack labels (3D hero) | `js/models/icons-data.js` → `iconStack` array |
| 5 | Skill categories | `portfolio.html` → `<section id="stack">` |
| 6 | Projects (data) | `js/models/projects-data.js` → `projectsData` array |
| 7 | Project screenshots | `projects/<your-slug>/` — match filenames to what you reference in `projects-data.js` |
| 8 | Experience timeline | `portfolio.html` → `<section id="experience">` |
| 9 | Contact info & social links | `portfolio.html` → `<section id="contact">` |
| 10 | Fonts | `js/tailwind-config.js` → `fontFamily`, plus the Google Fonts `<link>` in `portfolio.html` `<head>` |
| 11 | Favicon | Replace `favicon.svg` |
| 12 | Hero typewriter lines | `js/controllers/typewriter-controller.js` → `lines` array |
| 13 | Nav links | `portfolio.html` — update both the desktop `<nav>` and the mobile menu together |

**Tip:** search the file for your placeholder name/email to make sure nothing was missed before publishing.

---

## 8. Feature toggles

Every interactive feature is its own controller file and can be removed independently by deleting its `<script>` tag from `portfolio.html` — nothing else depends on them existing:

| To remove... | Delete this script tag |
|---|---|
| 3D hero background | `hero-scene-controller.js` (also remove the `<canvas id="hero-canvas">` and Three.js `<script>` tag) |
| Particle-network backdrop | `particle-network-controller.js` (also remove the `#particle-network` div) |
| Custom cursor | `custom-cursor-controller.js` |
| Tilt-on-hover cards | `tilt-controller.js` |
| Screenshot lightbox | `gallery-controller.js` |

---

## 9. Tech stack

- **HTML5** — semantic markup
- **Tailwind CSS** (CDN) — utility-first styling with custom theme config
- **Vanilla JavaScript** (ES6+) — no framework, no build step
- **Three.js r128** — 3D wireframe hero scene, sprite-based text labels
- **Canvas 2D API** — particle-network background (no external particle library)
- **Google Fonts** — Space Grotesk, Inter, JetBrains Mono

---

*Template built around a terminal/code-editor visual identity. Fork it, make it yours, ship it.*
