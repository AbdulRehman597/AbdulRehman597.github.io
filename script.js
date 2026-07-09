// ============================================
// NAV: scrolled state + mobile menu
// ============================================
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 12);
  scrollTopBtn.classList.toggle('is-visible', window.scrollY > 600);
}, { passive: true });

navBurger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navBurger.setAttribute('aria-expanded', open);
  navLinks.style.cssText = open
    ? 'display:flex; flex-direction:column; position:absolute; top:100%; left:0; right:0; background:rgba(9,6,15,0.97); padding:1.4rem 1.6rem; gap:1.1rem; border-bottom:1px solid rgba(168,137,255,0.14);'
    : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navLinks.style.cssText = '';
  });
});

// ============================================
// SCROLL TOP BUTTON
// ============================================
const scrollTopBtn = document.getElementById('scrollTop');
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// REVEAL ON SCROLL (mockups + bento cards)
// ============================================
const revealTargets = document.querySelectorAll('[data-animate="mockup"], .bento-card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);

      // trigger ring progress fill when its parent mockup becomes visible
      if (entry.target.id !== undefined) {
        const ring = entry.target.querySelector && entry.target.querySelector('#ringProgress');
        if (ring) {
          requestAnimationFrame(() => {
            ring.style.strokeDashoffset = 314 - (314 * 0.999); // 99.9%
          });
        }
      }
    }
  });
}, { threshold: 0.2 });

revealTargets.forEach((el, i) => {
  if (el.classList.contains('bento-card')) {
    el.style.transitionDelay = `${(i % 3) * 0.08}s`;
  }
  revealObserver.observe(el);
});

// ============================================
// ANIMATED STAT COUNTERS
// ============================================
const statNums = document.querySelectorAll('.stat-block__num');

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

// ============================================
// TERMINAL TYPING EFFECT
// ============================================
const typingText = document.getElementById('typingText');
const phrases = [
  'model.predict(x) -> "resolve_billing_issue" (0.97)',
  'retrieval: 4 chunks · rerank: top_k=3',
  'deploy: rolling update · 0 downtime'
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typingText) return;
  const current = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    typingText.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typingText.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 22 : 38);
}
typeLoop();

// ============================================
// CONTACT FORM (static — no backend)
// ============================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const emailInput = document.getElementById('emailInput');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = emailInput.value.trim();
  if (!value) return;

  formNote.textContent = `Thanks — I'll follow up at ${value} soon.`;
  formNote.classList.add('is-success');
  emailInput.value = '';
  emailInput.disabled = true;
  contactForm.querySelector('button').disabled = true;
});
