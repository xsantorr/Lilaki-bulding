/* =============================================
   PRIMEBUILD SOLUTIONS — script.js
   ============================================= */

'use strict';

/* ──────────────────────────────────────────────
   1. STICKY NAVBAR
   ────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

const handleScroll = () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* ──────────────────────────────────────────────
   2. HAMBURGER / MOBILE NAV
   ────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navItems  = navLinks.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ──────────────────────────────────────────────
   3. SCROLL REVEAL
   ────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children of a grid if they appear together
        entry.target.style.transitionDelay = '0ms';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

const staggerGroups = [
  '.services-grid',
  '.stats-grid',
  '.gallery-grid',
  '.about-perks',
  '.footer-grid',
];

document.querySelectorAll('.reveal').forEach((el, idx) => {
  // Check if it's inside a grid container for staggering
  const parent = el.parentElement;
  if (parent && staggerGroups.some(sel => parent.matches(sel))) {
    const siblings = Array.from(parent.children);
    const pos = siblings.indexOf(el);
    el.style.transitionDelay = `${pos * 80}ms`;
  }
  revealObserver.observe(el);
});

/* ──────────────────────────────────────────────
   4. COUNTER ANIMATION
   ────────────────────────────────────────────── */
const counters = document.querySelectorAll('.stat-num[data-target]');

const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach(c => counterObserver.observe(c));

/* ──────────────────────────────────────────────
   5. GALLERY LIGHTBOX
   ────────────────────────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxCap   = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let currentIndex = 0;

const openLightbox = (index) => {
  currentIndex = index;
  const item = galleryItems[currentIndex];
  lightboxImg.src = item.dataset.src;
  lightboxImg.alt = item.querySelector('img').alt;
  lightboxCap.textContent = item.dataset.caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 400);
};

const showPrev = () => {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
};

const showNext = () => {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  openLightbox(currentIndex);
};

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

/* ──────────────────────────────────────────────
   6. TESTIMONIALS SLIDER
   ────────────────────────────────────────────── */
const track   = document.getElementById('testimonialTrack');
const dots    = document.querySelectorAll('.t-dot');
const tPrev   = document.getElementById('tPrev');
const tNext   = document.getElementById('tNext');
const slides  = track.querySelectorAll('.testimonial-slide');
let current   = 0;
let autoTimer = null;

const goTo = (index) => {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
};

const startAuto = () => {
  autoTimer = setInterval(() => goTo(current + 1), 5500);
};

const stopAuto = () => clearInterval(autoTimer);

tPrev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
tNext.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    stopAuto();
    goTo(parseInt(dot.dataset.index, 10));
    startAuto();
  });
});

// Touch/swipe support
let touchStartX = 0;
track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
track.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    stopAuto();
    goTo(diff > 0 ? current + 1 : current - 1);
    startAuto();
  }
}, { passive: true });

goTo(0);
startAuto();

/* ──────────────────────────────────────────────
   7. CONTACT FORM
   ────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const toast       = document.getElementById('toast');

const showToast = () => {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
};

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Basic validation
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    // Highlight empty required fields
    [document.getElementById('name'), document.getElementById('email'), document.getElementById('message')].forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#c0392b';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });
    return;
  }

  // Simulate form submission
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    showToast();
  }, 1200);
});

/* ──────────────────────────────────────────────
   8. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navH = navbar.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ──────────────────────────────────────────────
   9. ACTIVE NAV HIGHLIGHT ON SCROLL
   ────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link:not(.nav-cta)');

const activateNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - navbar.offsetHeight - 80) {
      current = sec.id;
    }
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
};

window.addEventListener('scroll', activateNav, { passive: true });