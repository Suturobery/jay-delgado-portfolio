// CONTROLLER: Three.js hero background - rotating wireframe icosahedron with tech-stack
// icon sprites riding its surface, plus an ambient particle field. Depends on THREE (CDN)
// and the iconStack array defined in js/models/icons-data.js (load that script first).
(function heroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 7;

  // Sizing scales down (and the sphere widens) automatically as iconStack grows, so a
  // long stack list stays readable instead of overlapping into an unreadable cluster.
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const stackCount = iconStack.length;
  const outerRadius = clamp(2.3 + (stackCount - 8) * 0.02, 2.3, 3.1);
  const labelBaseHeight = clamp(0.34 - (stackCount - 8) * 0.0045, 0.15, 0.34);
  const labelOrbitRadius = clamp(outerRadius + 0.6, 2.6, 4.3);

  const geo = new THREE.IcosahedronGeometry(outerRadius, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0x3D5CFF, wireframe: true, transparent: true, opacity: 0.55 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  const innerGeo = new THREE.IcosahedronGeometry(outerRadius * 0.65, 0);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xF5F5F2, wireframe: true, transparent: true, opacity: 0.15 });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerMesh);

  // Tech-stack labels rendered as plain monospace text (not logos) - reads clearly at any
  // size, matches the site's font system (JetBrains Mono), and avoids the readability issues
  // of tiny icon glyphs. Canvas is sized to fit each label's actual text width. Font size
  // itself stays fixed for crisp rendering; the sprite's final on-screen size is controlled
  // by labelBaseHeight (computed above from the stack count) via sprite.scale.
  function makeLabelSprite(item) {
    const fontSize = 36;
    const font = `700 ${fontSize}px "JetBrains Mono", monospace`;
    const paddingX = 24;
    const paddingY = 18;

    // measure text first on a scratch context to size the canvas correctly
    const measureCtx = document.createElement('canvas').getContext('2d');
    measureCtx.font = font;
    const textWidth = measureCtx.measureText(item.label).width;

    const width = Math.ceil(textWidth + paddingX * 2);
    const height = fontSize + paddingY * 2;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // soft glow behind the text for a bit of presence against the dark background
    ctx.shadowColor = 'rgba(61,92,255,0.9)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#3D5CFF';
    ctx.fillText(item.label, width / 2, height / 2);

    // crisp paper-white pass on top, no shadow, for readability
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#F5F5F2';
    ctx.fillText(item.label, width / 2, height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 1, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMat);

    // scale sprite so text height stays consistent regardless of label length
    const aspect = width / height;
    sprite.scale.set(labelBaseHeight * aspect, labelBaseHeight, 1);

    return sprite;
  }

  const stackSprites = [];
  const stackGroup = new THREE.Group();
  iconStack.forEach((item, i) => {
    const sprite = makeLabelSprite(item);
    const phi = Math.acos(1 - 2 * (i + 0.5) / stackCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    sprite.position.set(
      labelOrbitRadius * Math.sin(phi) * Math.cos(theta),
      labelOrbitRadius * Math.sin(phi) * Math.sin(theta),
      labelOrbitRadius * Math.cos(phi)
    );
    stackSprites.push(sprite);
    stackGroup.add(sprite);
  });
  // parent to the main wireframe mesh so the labels spin together with the sphere, not independently
  mesh.add(stackGroup);

  // ambient particles
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) positions[i] = (Math.random() - 0.5) * 20;
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0xF5F5F2, size: 0.02, transparent: true, opacity: 0.4 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate() {
    requestAnimationFrame(animate);
    if (!reducedMotion) {
      mesh.rotation.x += 0.0018;
      mesh.rotation.y += 0.0026;
      innerMesh.rotation.x -= 0.0012;
      innerMesh.rotation.y -= 0.0016;
      particles.rotation.y += 0.0003;

      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
    }
    renderer.render(scene, camera);
  }
  animate();
})();
