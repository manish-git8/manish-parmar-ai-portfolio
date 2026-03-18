/* ============================================================
   MANISH PARMAR PORTFOLIO — script.js
   betteroff.studio-inspired animations & interactions
   ============================================================ */

(function () {
  'use strict';

  /* ---- SCROLL PROGRESS BAR ---- */
  const progressBar = document.createElement('div');
  progressBar.classList.add('progress-bar');
  document.body.prepend(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.08;
    followerY += (mouseY - followerY) * 0.08;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Action Text setup
  const cursorTextEl = document.createElement('span');
  cursorTextEl.className = 'cursor-text';
  cursor.appendChild(cursorTextEl);

  // General Hover State
  const hoverTargets = document.querySelectorAll('a, button, .skill-pill, .tag, .project-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (el.classList.contains('project-card')) {
        document.body.classList.add('cursor-hover-text');
        cursorTextEl.textContent = 'View';
      } else {
        document.body.classList.add('cursor-hover');
      }
    });

    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      document.body.classList.remove('cursor-hover-text');
      cursorTextEl.textContent = '';
    });
  });

  // Click Ripple effect
  document.addEventListener('click', () => {
    follower.classList.add('ripple');
    setTimeout(() => {
      follower.classList.remove('ripple');
    }, 500); // match animation duration
  });

  // Magnetic items (Buttons & Links)
  const magneticTargets = document.querySelectorAll('.nav-cta, .nav-menu-btn, .form-submit, .menu-item, .project-card, .menu-social');
  magneticTargets.forEach(el => {
    el.classList.add('magnetic');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Pull strength depends on element type
      const pull = el.classList.contains('project-card') ? 0.05 : 0.3;
      el.style.transform = `translate(${x * pull}px, ${y * pull}px)`;

      // Pull the cursor slightly too to give a heavier "snap" feel
      cursor.style.transform = `translate(calc(-50% + ${x * (pull * 0.5)}px), calc(-50% + ${y * (pull * 0.5)}px))`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      cursor.style.transform = 'translate(-50%, -50%)';
    });
  });

  /* ---- MENU TOGGLE ---- */
  const menuBtn = document.getElementById('menuBtn');
  const menuOverlay = document.getElementById('menuOverlay');
  const nav = document.getElementById('nav');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    menuOverlay.classList.add('open');
    menuBtn.textContent = 'Close';
    document.body.style.overflow = 'hidden';

    // Stagger menu items
    const items = menuOverlay.querySelectorAll('.menu-item');
    items.forEach((item, i) => {
      item.style.transitionDelay = (i * 0.07) + 's';
    });
  }

  function closeMenu() {
    menuOpen = false;
    menuOverlay.classList.remove('open');
    menuBtn.textContent = 'Menu';
    document.body.style.overflow = '';

    const items = menuOverlay.querySelectorAll('.menu-item');
    items.forEach(item => { item.style.transitionDelay = '0s'; });
  }

  menuBtn.addEventListener('click', () => {
    if (menuOpen) closeMenu(); else openMenu();
  });

  // Close menu on link click
  menuOverlay.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  /* ---- STICKY NAV with dark-mode on dark sections ---- */
  const DARK_SECTIONS = ['#skills', '#contact'];
  const darkSections = DARK_SECTIONS.map(sel => document.querySelector(sel)).filter(Boolean);

  function updateNavTheme() {
    const navBottom = nav.getBoundingClientRect().bottom;
    let isDark = false;
    darkSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navBottom && rect.bottom >= 0) isDark = true;
    });
    nav.classList.toggle('dark-nav', isDark);
  }

  /* ---- INTERSECTION OBSERVER — Reveal animations ---- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll(
    '.reveal-text, .reveal-text-dark, .about-statement, .skills-giant, .projects-giant, .contact-giant'
  ).forEach(el => revealObs.observe(el));

  /* ---- Skill rows staggered reveal ---- */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const rows = entry.target.querySelectorAll('.skill-row');
        rows.forEach((row, i) => {
          setTimeout(() => row.classList.add('visible'), i * 100);
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) skillObs.observe(skillsGrid);

  /* ---- Project cards staggered reveal ---- */
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.project-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 120);
        });
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const projectsGrids = document.querySelectorAll('.projects-grid');
  projectsGrids.forEach(grid => cardObs.observe(grid));

  /* ---- Section bg color transitions ---- */
  const sectionColorObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        const isDark = section.classList.contains('skills') || section.classList.contains('contact');
        document.body.style.backgroundColor = isDark ? '#1a1a1a' : '#dcdcd4';
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('section').forEach(sec => sectionColorObs.observe(sec));

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = nav.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Marquee speed control on hover ---- */
  const marqueeTrack = document.getElementById('marqueeTrack');
  const marqueeTrack2 = document.getElementById('marqueeTrack2');

  function slowMarquee(track) {
    if (track) track.style.animationDuration = '40s';
  }
  function normalMarquee(track) {
    if (track) track.style.animationDuration = '22s';
  }

  document.querySelector('.marquee-strip')?.addEventListener('mouseenter', () => slowMarquee(marqueeTrack));
  document.querySelector('.marquee-strip')?.addEventListener('mouseleave', () => normalMarquee(marqueeTrack));
  document.querySelectorAll('.marquee-strip')[1]?.addEventListener('mouseenter', () => slowMarquee(marqueeTrack2));
  document.querySelectorAll('.marquee-strip')[1]?.addEventListener('mouseleave', () => normalMarquee(marqueeTrack2));

  /* ---- Contact Form (Web3Forms) ---- */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitText = submitBtn.querySelector('.submit-text');
      submitText.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.success) {
          formSuccess.textContent = '✓ Success! Message sent to manish.prm86@gmail.com.';
          contactForm.reset();
          submitText.textContent = 'Send Message';
          submitBtn.disabled = false;
        } else {
          throw new Error('Failed');
        }
      } catch {
        formSuccess.textContent = '✗ Something went wrong. Please try again.';
        formSuccess.style.color = '#ef4444';
        submitText.textContent = 'Send Message';
        submitBtn.disabled = false;
      }
    });
  }

  /* ---- Parallax: hero giant text subtle scroll ---- */
  const heroMarquee = document.getElementById('heroMarquee');

  /* ---- SCROLL ZOOM IN ONLY (GPU-accelerated, lag-free) ---- */
  const zoomTitles = [
    { el: document.querySelector('.hero-marquee-track'), fromScale: 0.75 },
    { el: document.querySelector('.skills-giant'), fromScale: 0.60 },
    { el: document.querySelector('.projects-giant'), fromScale: 0.60 },
    { el: document.querySelector('.contact-giant'), fromScale: 0.60 },
    { el: document.querySelector('.about-statement'), fromScale: 0.82 },
  ].filter(t => t.el !== null);

  // Pre-promote each element to its own GPU layer and cache last scale
  zoomTitles.forEach(t => {
    t.el.style.willChange = 'transform';
    t.el.style.transform = `scale(${t.fromScale}) translateZ(0)`;
    t.el.style.transformOrigin = 'center center';
    t._lastScale = t.fromScale;
  });

  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

  function updateZoomTitles() {
    const vh = window.innerHeight;
    zoomTitles.forEach(t => {
      const rect = t.el.getBoundingClientRect();
      const elH = rect.height || 1;
      // progress 0→1 as element travels from entering bottom to fully in centre
      const travel = vh * 0.7 + elH * 0.5;          // trigger zone
      const traveled = (vh - rect.top);
      const raw = Math.min(Math.max(traveled / travel, 0), 1);
      const easedP = easeOutCubic(raw);
      const scale = t.fromScale + (1 - t.fromScale) * easedP;

      // Skip DOM write if change is imperceptible (< 0.5%)
      if (Math.abs(scale - t._lastScale) < 0.005) return;
      t._lastScale = scale;
      t.el.style.transform = `scale(${scale.toFixed(4)}) translateZ(0)`;
    });
  }

  /* ---- Tilt effect on project cards ---- */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const tiltX = dy * -8;
      const tiltY = dx * 8;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- Line-by-line text reveal on scroll ---- */
  function splitAndReveal(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      const text = el.innerHTML;
      const words = text.split(' ');
      el.innerHTML = words.map((word, i) =>
        `<span style="display:inline-block;opacity:0;transform:translateY(20px);transition:opacity 0.5s ${i * 0.04}s,transform 0.5s ${i * 0.04}s cubic-bezier(0.16,1,0.3,1)">${word}&nbsp;</span>`
      ).join('');
    });
  }

  /* ---- Scroll-based nav "active" highlighting ---- */
  const sections = document.querySelectorAll('section[id]');
  function updateActiveSection() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        // could update nav active state here
      }
    });
  }

  /* ---- Number counter animation ---- */
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start);
    }, 16);
  }

  /* ---- Hero bubbles restart on re-entry ---- */
  const heroBubblesObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bubbles = entry.target.querySelectorAll('.bubble');
        bubbles.forEach(b => {
          b.style.animation = 'none';
          void b.offsetWidth; // reflow
          b.style.animation = '';
        });
      }
    });
  }, { threshold: 0.5 });

  const heroBubbles = document.getElementById('heroProfileCard');
  if (heroBubbles) heroBubblesObs.observe(heroBubbles);

  /* ---- MAIN SCROLL HANDLER ---- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNavTheme();
        updateActiveSection();
        updateZoomTitles();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---- INIT ---- */
  updateProgress();
  updateNavTheme();
  updateZoomTitles();

  /* ---- Page load animation ---- */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  });

  /* ---- Typing effect for hero tagline ---- */
  function typingEffect(element, text, speed = 60, delay = 0) {
    setTimeout(() => {
      element.textContent = '';
      let i = 0;
      const timer = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(timer);
      }, speed);
    }, delay);
  }

  /* ---- Terminal Typing Effect ---- */
  const termBody = document.getElementById('termBody');
  if (termBody) {
    const codeLines = [
      "from langchain import OpenAI, LLMChain",
      "from agents import DeveloperAgent",
      "",
      "# Initialize core builder agent",
      "agent = DeveloperAgent(",
      "    name='Manish',",
      "    skills=['Python', 'LLMs', 'RAG'],",
      "    passion='Building the future'",
      ")",
      "",
      "agent.execute('Build scalable AI')"
    ];

    let lineIdx = 0;
    let charIdx = 0;

    function typeTerminal() {
      if (lineIdx >= codeLines.length) return;

      const currentLine = codeLines[lineIdx];
      if (charIdx === 0) {
        termBody.appendChild(document.createElement('div'));
      }

      const latestDiv = termBody.lastElementChild;

      if (charIdx < currentLine.length) {
        latestDiv.textContent += currentLine[charIdx];
        charIdx++;
        setTimeout(typeTerminal, Math.random() * 30 + 20);
      } else {
        lineIdx++;
        charIdx = 0;
        setTimeout(typeTerminal, 400);
      }
    }

    // Start terminal typing after a short delay
    setTimeout(typeTerminal, 1500);
  }

  /* ---- Stats Counter Animation ---- */
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.stat-number');
        numbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'), 10);
          animateCounter(num, target, 2000);
        });
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) statsObs.observe(statsSection);

  /* ---- Glitch effect on logo hover ---- */
  const logo = document.querySelector('.logo-link');
  if (logo) {
    logo.addEventListener('mouseenter', () => {
      logo.style.transition = 'none';
      let count = 0;
      const glitch = setInterval(() => {
        logo.style.letterSpacing = (Math.random() > 0.5 ? '-0.05em' : '-0.02em');
        logo.style.transform = `translate(${(Math.random() - 0.5) * 3}px, ${(Math.random() - 0.5) * 3}px)`;
        count++;
        if (count > 8) {
          clearInterval(glitch);
          logo.style.letterSpacing = '-0.02em';
          logo.style.transform = '';
          logo.style.transition = '';
        }
      }, 50);
    });
  }

  /* ---- Skills section — pill hover pulse ---- */
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      pill.style.transform = 'scale(1.05)';
      pill.style.transition = 'all 0.3s cubic-bezier(0.16,1,0.3,1)';
    });
    pill.addEventListener('mouseleave', () => {
      pill.style.transform = '';
    });
  });

  /* ---- Project Hover Image Reveal ---- */
  const hoverImageWrapper = document.getElementById('hoverImageWrapper');
  const hoverImage = document.getElementById('hoverImage');
  let hoverImgX = mouseX;
  let hoverImgY = mouseY;
  let targetImgX = mouseX;
  let targetImgY = mouseY;

  function animateHoverImage() {
    hoverImgX += (targetImgX - hoverImgX) * 0.1;
    hoverImgY += (targetImgY - hoverImgY) * 0.1;
    if (hoverImageWrapper) {
      hoverImageWrapper.style.left = hoverImgX + 'px';
      hoverImageWrapper.style.top = hoverImgY + 'px';
    }
    requestAnimationFrame(animateHoverImage);
  }
  if (hoverImageWrapper) animateHoverImage();

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const imgUrl = card.getAttribute('data-image');
      if (imgUrl && hoverImage) {
        hoverImage.src = imgUrl;
        hoverImageWrapper.classList.add('visible');
      }
    });

    card.addEventListener('mousemove', (e) => {
      targetImgX = e.clientX;
      targetImgY = e.clientY;
    });

    card.addEventListener('mouseleave', () => {
      if (hoverImageWrapper) {
        hoverImageWrapper.classList.remove('visible');
      }
    });
  });

  console.log('%c Manish Parmar — AI Portfolio 🚀',
    'color: #7c3aed; font-size: 18px; font-weight: bold; padding: 8px 16px; background: #f5f3ff; border-radius: 4px;');

  /* ================================================================
     ADVANCED AURORA NEBULA BACKGROUND ENGINE
     Technique: multi-harmonic sinusoidal noise field → per-pixel RGBA
     + luminous particle system + CSS mouse-flashlight dot grid
     ================================================================ */
  (function initAurora() {
    const canvas = document.getElementById('auroraCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const grid = document.getElementById('heroDotGrid');

    let W, H, imageData, data;
    let t = 0;
    let mx = 0.5, my = 0.5; // normalised mouse 0-1

    // ── Resize ──────────────────────────────────────────────
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      imageData = ctx.createImageData(W, H);
      data = imageData.data;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Mouse → flashlight grid reveal + aurora warp ────────
    const hero = canvas.closest('section');
    hero && hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width;
      my = (e.clientY - rect.top)  / rect.height;
      if (grid) {
        grid.style.setProperty('--mx', (mx * 100).toFixed(1) + '%');
        grid.style.setProperty('--my', (my * 100).toFixed(1) + '%');
      }
    });

    // ── Aurora color palette (HSL control points) ───────────
    // Each band: [hue, sat, lig, weight]
    const bands = [
      [265, 90, 55, 1.0],  // vivid purple
      [200, 95, 50, 0.8],  // cyan-blue
      [160, 88, 45, 0.6],  // emerald
      [300, 80, 50, 0.5],  // magenta
      [220, 95, 60, 0.7],  // blue
    ];

    // ── Harmonic noise (no external library needed) ──────────
    function noise(x, y, t) {
      const n =
        Math.sin(x * 2.1 + t * 0.6)     * 0.30 +
        Math.sin(y * 1.8 - t * 0.4)     * 0.25 +
        Math.sin((x + y) * 1.4 + t * 0.8) * 0.20 +
        Math.sin(x * 0.9 - y * 1.3 + t) * 0.15 +
        Math.sin((x * 0.5 + y * 0.7) * 2.2 - t * 0.5) * 0.10;
      return n * 0.5 + 0.5; // 0..1
    }

    // ── Parse HSL → RGB ─────────────────────────────────────
    function hslToRgb(h, s, l) {
      s /= 100; l /= 100;
      const k = n => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [f(0) * 255, f(8) * 255, f(4) * 255];
    }

    // ── Low-res pixel pass (done every frame on a step grid) ─
    const STEP = 4; // sample every 4px for performance

    function drawAurora() {
      const tt = t * 0.35;
      for (let py = 0; py < H; py += STEP) {
        for (let px = 0; px < W; px += STEP) {
          const nx = px / W;
          const ny = py / H;

          // Mouse-warp: pull field toward cursor slightly
          const warpX = nx + (mx - 0.5) * 0.12;
          const warpY = ny + (my - 0.5) * 0.10;

          // Blend multiple aurora bands
          let rSum = 0, gSum = 0, bSum = 0, wSum = 0;
          bands.forEach(([h, s, l, w], i) => {
            const n = noise(warpX * (1 + i * 0.3), warpY * (1.5 + i * 0.2), tt + i * 1.1);
            const intensity = Math.pow(n, 1.8); // contrast boost
            const [r, g, b] = hslToRgb((h + n * 40) % 360, s, l);
            rSum += r * intensity * w;
            gSum += g * intensity * w;
            bSum += b * intensity * w;
            wSum += intensity * w;
          });

          const inv = wSum > 0 ? 1 / wSum : 0;
          const r = Math.min(rSum * inv * 0.72, 255);
          const g = Math.min(gSum * inv * 0.72, 255);
          const b = Math.min(bSum * inv * 0.72, 255);

          // alpha: strongest at top-center, fades at edges/bottom
          const edgeDist = 1 - Math.abs(nx - 0.5) * 1.6;
          const alpha = Math.max(0, Math.min(edgeDist * (1 - ny * 0.55) * 200, 180));

          // Fill the STEP×STEP block
          for (let dy = 0; dy < STEP && py + dy < H; dy++) {
            for (let dx = 0; dx < STEP && px + dx < W; dx++) {
              const idx = ((py + dy) * W + (px + dx)) * 4;
              data[idx]     = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = alpha;
            }
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // ── Luminous particle system ─────────────────────────────
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.18,
      hue: Math.floor(Math.random() * 100) + 200, // blue-purple range
      alpha: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    function drawParticles() {
      particles.forEach(p => {
        p.twinkle += 0.03;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.twinkle));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 80%, ${a})`;
        ctx.shadowColor = `hsl(${p.hue}, 90%, 60%)`;
        ctx.shadowBlur = p.r * 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.vx + (mx - 0.5) * 0.04;
        p.y += p.vy + (my - 0.5) * 0.03;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });
    }

    // ── Main loop ────────────────────────────────────────────
    let frameCount = 0;
    function loop() {
      t += 0.008;
      frameCount++;

      // Aurora re-render every 2 frames (heavy operation, still 30fps)
      if (frameCount % 2 === 0) drawAurora();

      // Particles every frame
      drawParticles();
      requestAnimationFrame(loop);
    }
    loop();
  })();

})();

