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
    { el: document.querySelector('.skills-giant'),       fromScale: 0.60 },
    { el: document.querySelector('.projects-giant'),     fromScale: 0.60 },
    { el: document.querySelector('.contact-giant'),      fromScale: 0.60 },
    { el: document.querySelector('.about-statement'),    fromScale: 0.82 },
  ].filter(t => t.el !== null);

  // Pre-promote each element to its own GPU layer and cache last scale
  zoomTitles.forEach(t => {
    t.el.style.willChange = 'transform';
    t.el.style.transform  = `scale(${t.fromScale}) translateZ(0)`;
    t.el.style.transformOrigin = 'center center';
    t._lastScale = t.fromScale;
  });

  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

  function updateZoomTitles() {
    const vh = window.innerHeight;
    zoomTitles.forEach(t => {
      const rect  = t.el.getBoundingClientRect();
      const elH   = rect.height || 1;
      // progress 0→1 as element travels from entering bottom to fully in centre
      const travel   = vh * 0.7 + elH * 0.5;          // trigger zone
      const traveled = (vh - rect.top);
      const raw      = Math.min(Math.max(traveled / travel, 0), 1);
      const easedP   = easeOutCubic(raw);
      const scale    = t.fromScale + (1 - t.fromScale) * easedP;

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
        `<span style="display:inline-block;opacity:0;transform:translateY(20px);transition:opacity 0.5s ${i*0.04}s,transform 0.5s ${i*0.04}s cubic-bezier(0.16,1,0.3,1)">${word}&nbsp;</span>`
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
        logo.style.transform = `translate(${(Math.random()-0.5)*3}px, ${(Math.random()-0.5)*3}px)`;
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
     EFFECT 1: NEURAL NETWORK CANVAS (Hero background)
     ================================================================ */
  (function initNeuralNetwork() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let nodes = [];
    let mouse = { x: canvas.offsetWidth / 2, y: canvas.offsetHeight / 2 };
    const NODE_COUNT = 55;
    const MAX_DIST = 160;
    const COLORS = ['#7c3aed', '#10b981', '#ec4899', '#3b82f6'];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2.5 + 1.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    document.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = 1 - dist / MAX_DIST;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,58,237,${alpha * 0.5})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Mouse connection
        const mx = nodes[i].x - mouse.x, my = nodes[i].y - mouse.y;
        const mdist = Math.sqrt(mx * mx + my * my);
        if (mdist < MAX_DIST * 1.5) {
          const alpha = 1 - mdist / (MAX_DIST * 1.5);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(16,185,129,${alpha * 0.7})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Move
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        // Slight mouse attraction
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) {
          n.vx += dx * 0.00015;
          n.vy += dy * 0.00015;
        }
        // Cap speed
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 1.5) { n.vx = (n.vx / speed) * 1.5; n.vy = (n.vy / speed) * 1.5; }
      });

      requestAnimationFrame(drawFrame);
    }
    drawFrame();
  })();

  /* ================================================================
     EFFECT 2: MATRIX RAIN (About + Projects sections)
     ================================================================ */
  function initMatrixRain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{};<>?,./あいうえおアイウエオ';
    const fontSize = 13;
    let cols, drops;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1).map(() => Math.floor(Math.random() * -50));
    }
    resize();
    window.addEventListener('resize', resize);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
  }

  initMatrixRain('matrixCanvas');
  initMatrixRain('matrixCanvas2');

  /* ================================================================
     EFFECT 3: GLITCH TEXT on contact section heading
     ================================================================ */
  (function initGlitch() {
    const glitchTarget = document.querySelector('.contact-giant');
    if (!glitchTarget) return;
    glitchTarget.classList.add('glitch');
    glitchTarget.setAttribute('data-text', glitchTarget.textContent);
  })();

})();

