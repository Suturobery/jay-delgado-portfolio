// CONTROLLER: hero tagline typewriter effect. Edit the `lines` array to change what cycles through.
const typewriterLines = ["Junior PHP/Laravel Developer", "PHP & Laravel", "shipping role-based systems"];
const typewriterEl = document.getElementById('typewriter');
let twLineIndex = 0, twCharIndex = 0, twDeleting = false;

function typewriterTick() {
  const current = typewriterLines[twLineIndex];
  if (!twDeleting) {
    twCharIndex++;
    typewriterEl.textContent = current.slice(0, twCharIndex);
    if (twCharIndex === current.length) { twDeleting = true; setTimeout(typewriterTick, 1400); return; }
  } else {
    twCharIndex--;
    typewriterEl.textContent = current.slice(0, twCharIndex);
    if (twCharIndex === 0) { twDeleting = false; twLineIndex = (twLineIndex + 1) % typewriterLines.length; }
  }
  setTimeout(typewriterTick, twDeleting ? 35 : 65);
}
typewriterTick();
