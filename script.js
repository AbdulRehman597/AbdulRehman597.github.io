/* ============================================================
   PORTFOLIO SCRIPT — Silicon Codex
   ============================================================ */

'use strict';

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  // Only run on devices that actually have a pointer
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  const tickRing = () => {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(tickRing);
  };
  tickRing();

  // Expand ring on interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .pill, .contact-item');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering'));
  });

  // Fade out when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ============================================================
   SCROLL PROGRESS BAR + HEADER SCROLL STATE
   ============================================================ */
(function initScrollEffects() {
  const bar    = document.querySelector('.scroll-bar');
  const header = document.getElementById('site-header');
  if (!bar || !header) return;

  const onScroll = () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
    header.classList.toggle('scrolled', scrolled > 60);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ============================================================
   ACTIVE NAV LINK (scroll spy)
   ============================================================ */
(function initScrollSpy() {
  const sections  = [...document.querySelectorAll('main section[id]')];
  const navLinks  = [...document.querySelectorAll('.site-nav a')];
  if (!sections.length || !navLinks.length) return;

  const setActive = () => {
    const threshold = window.scrollY + 160;
    let current = sections[0].id;

    sections.forEach((sec) => {
      if (sec.offsetTop <= threshold) current = sec.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  setActive();
  window.addEventListener('scroll', setActive, { passive: true });
})();

/* ============================================================
   TYPEWRITER
   ============================================================ */
(function initTypewriter() {
  const el = document.querySelector('.typewriter');
  if (!el) return;

  let words;
  try { words = JSON.parse(el.dataset.words || '[]'); } catch { return; }
  if (!words.length) return;

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const PAUSE_AFTER_WORD = 1900;
  const SPEED_TYPE  = 95;
  const SPEED_DELETE = 55;

  const tick = () => {
    const word = words[wordIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = word.slice(0, charIdx);

      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, PAUSE_AFTER_WORD);
        return;
      }
    } else {
      charIdx--;
      el.textContent = word.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
      }
    }

    setTimeout(tick, deleting ? SPEED_DELETE : SPEED_TYPE);
  };

  // Start after slight delay so hero animation plays first
  setTimeout(tick, 900);
})();

/* ============================================================
   SCROLL-TRIGGERED REVEALS
   (respects prefers-reduced-motion)
   ============================================================ */
(function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const groups = [
    // Generic section headings / tags
    { selector: '.section-tag, h2', delay: false },
    // About
    { selector: '.about-left, .about-right', delay: true },
    // Project cards — staggered
    { selector: '.project-card', delay: true },
    // Skill groups — staggered
    { selector: '.skill-group', delay: true },
    // Timeline entry
    { selector: '.timeline-entry', delay: false },
    // Contact pieces — staggered
    { selector: '.contact-left, .contact-sub, .contact-item', delay: true },
    // Stats
    { selector: '.stat', delay: true },
  ];

  const delayClasses = ['', 'reveal-d1', 'reveal-d2', 'reveal-d3'];

  groups.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      el.classList.add('reveal');
      if (delay) {
        el.classList.add(delayClasses[Math.min(idx, 3)]);
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

/* ============================================================
   SMOOTH ANCHOR CLICKS (accessibility-friendly)
   ============================================================ */
(function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      // If user has no preference against motion, scroll smoothly;
      // otherwise let the browser's instant scroll handle it
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update URL without triggering scroll jump
        history.pushState(null, '', `#${id}`);
      }
    });
  });
})();
