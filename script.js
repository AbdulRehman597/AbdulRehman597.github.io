const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a')];

if (sections.length && navLinks.length) {
  const setActiveNav = () => {
    const threshold = window.scrollY + 120;
    let currentId = sections[0].id;

    sections.forEach((section) => {
      if (section.offsetTop <= threshold) currentId = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  setActiveNav();
  window.addEventListener('scroll', setActiveNav, { passive: true });
}

if (!reducedMotion) {
  const revealTargets = document.querySelectorAll('.section, .hero, .card');
  revealTargets.forEach((item) => item.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((item) => observer.observe(item));
}
