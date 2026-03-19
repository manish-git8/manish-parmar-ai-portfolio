(function () {
  const container = document.getElementById('ai-canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  // Deep blue background to match the theme
  scene.background = new THREE.Color('#0f172a'); 

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth || 400, container.clientHeight || 800);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;

  // Add a glowing core (Icosahedron)
  const coreGeometry = new THREE.IcosahedronGeometry(1, 1);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x7c3aed, // Electric purple
    emissive: 0x4c1d95,
    wireframe: true,
    transparent: true,
    opacity: 0.8,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(core);

  // Inner solid core
  const innerGeometry = new THREE.IcosahedronGeometry(0.8, 0);
  const innerMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff, // Clean white
    emissive: 0x2dd4bf,
    shininess: 100,
    flatShading: true,
  });
  const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
  scene.add(innerCore);

  // Floating particles around the core
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800;
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 8; // Random positions spanning -4 to 4
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xa855f7, // lighter purple
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate core
    core.rotation.y = elapsedTime * 0.2;
    core.rotation.x = elapsedTime * 0.1;
    innerCore.rotation.y = elapsedTime * 0.5;

    // Rotate particles slightly and bob up/down
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    if(container.clientWidth === 0) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Export a function to resize the canvas when drawer opens
  window.resizeAICore = function() {
    if(container.clientWidth > 0) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  };
})();
