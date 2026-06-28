/* ─── Nav toggle ──────────────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─── Active nav link on scroll ──────────────────────────── */
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a')];

const setActiveNav = () => {
  const threshold = window.scrollY + 130;
  let current = sections[0]?.id || '';
  sections.forEach(s => { if (s.offsetTop <= threshold) current = s.id; });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

setActiveNav();
window.addEventListener('scroll', setActiveNav, { passive: true });

/* ─── Scroll reveal ───────────────────────────────────────── */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealAll = () => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
};

if (reducedMotion) {
  revealAll();
} else {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ─── Skill bars (animate on first visibility) ────────────── */
const skillBars = document.querySelectorAll('.skill-bar-fill');

const animateBars = () => {
  skillBars.forEach(bar => {
    const pct = bar.getAttribute('data-pct');
    bar.style.width = pct + '%';
  });
};

if (reducedMotion) {
  animateBars();
} else {
  const skillSection = document.getElementById('skills-grid');
  if (skillSection) {
    const skillObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(animateBars, 150);
        skillObs.disconnect();
      }
    }, { threshold: 0.2 });
    skillObs.observe(skillSection);
  }
}

/* ─── Terminal typewriter ─────────────────────────────────── */
const terminalBody = document.getElementById('terminal-body');

const lines = [
  { type: 'cmd',  text: 'whoami' },
  { type: 'out',  text: 'Abdul Rehman' },
  { type: 'cmd',  text: 'cat skills.txt' },
  { type: 'acc',  text: 'Python, ML, FastAPI, React' },
  { type: 'out',  text: 'Deep Learning, SQL, Git' },
  { type: 'cmd',  text: 'echo $STATUS' },
  { type: 'acc',  text: 'Open to opportunities ✓' },
];

let lineIdx = 0;
let charIdx = 0;
let isTyping = false;

const promptSpan = () => {
  const s = document.createElement('span');
  s.className = 't-prompt';
  s.textContent = '~ $ ';
  return s;
};

const renderCursor = () => {
  const cur = document.createElement('span');
  cur.className = 't-cursor';
  cur.id = 'term-cursor';
  return cur;
};

const removeCursor = () => {
  const c = document.getElementById('term-cursor');
  if (c) c.remove();
};

const typeLine = () => {
  if (lineIdx >= lines.length) {
    removeCursor();
    const finalLine = document.createElement('span');
    finalLine.className = 't-line';
    finalLine.appendChild(promptSpan());
    finalLine.appendChild(renderCursor());
    terminalBody.appendChild(finalLine);
    return;
  }

  const line = lines[lineIdx];
  const isCmd = line.type === 'cmd';

  if (charIdx === 0) {
    removeCursor();
    const span = document.createElement('span');
    span.className = 't-line';
    span.id = 'current-line';
    if (isCmd) span.appendChild(promptSpan());
    terminalBody.appendChild(span);
  }

  const currentLine = document.getElementById('current-line');
  if (!currentLine) return;

  if (charIdx < line.text.length) {
    const textNode = document.createTextNode(line.text[charIdx]);
    const charSpan = document.createElement('span');
    charSpan.className = 't-' + line.type;
    charSpan.appendChild(textNode);
    currentLine.appendChild(charSpan);

    const cursor = renderCursor();
    currentLine.appendChild(cursor);
    charIdx++;
    setTimeout(typeLine, isCmd ? 55 : 20);
  } else {
    charIdx = 0;
    lineIdx++;
    setTimeout(typeLine, isCmd ? 380 : 200);
  }
};

if (terminalBody && !reducedMotion) {
  setTimeout(typeLine, 800);
} else if (terminalBody) {
  lines.forEach(line => {
    const span = document.createElement('span');
    span.className = 't-line';
    if (line.type === 'cmd') span.appendChild(promptSpan());
    const text = document.createElement('span');
    text.className = 't-' + line.type;
    text.textContent = line.text;
    span.appendChild(text);
    terminalBody.appendChild(span);
  });
}

/* ─── Stagger card reveal ─────────────────────────────────── */
if (!reducedMotion) {
  const cards = document.querySelectorAll('.card');
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }, i * 90);
        cardObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease';
    cardObs.observe(card);
  });
}
