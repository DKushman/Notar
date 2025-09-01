// Utility
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Footer year
const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = $('.nav-toggle');
const mobileNav = $('#mobile-nav');
const mobileNavOverlay = $('#mobile-nav-overlay');
let isMobileNavOpen = false;

if (navToggle && mobileNav && mobileNavOverlay){
  // Toggle mobile navigation
  navToggle.addEventListener('click', () => {
    if (isMobileNavOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Close mobile nav when clicking overlay
  mobileNavOverlay.addEventListener('click', closeMobileNav);

  // Close mobile nav when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileNavOpen) {
      closeMobileNav();
    }
  });

  function openMobileNav() {
    isMobileNavOpen = true;
    mobileNav.removeAttribute('hidden');
    mobileNav.classList.add('show');
    mobileNavOverlay.classList.add('show');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeMobileNav() {
    isMobileNavOpen = false;
    mobileNav.classList.remove('show');
    mobileNavOverlay.classList.remove('show');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore background scroll
    
    // Hide mobile nav after animation
    setTimeout(() => {
      if (!isMobileNavOpen) {
        mobileNav.setAttribute('hidden', '');
      }
    }, 400);
  }
}

// Scroll‑driven header theme
const header = $('#site-header');
const hero = $('#hero');

function applyHeaderBlend(inHero){
  if (!header) return;
  if (inHero){
    header.classList.add('blend');
    header.classList.remove('solid','theme-dark','theme-light');
  } else {
    header.classList.remove('blend');
    header.classList.add('solid');
  }
}

// Observe hero to decide blend vs solid
const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    applyHeaderBlend(e.isIntersecting);
  });
}, { rootMargin: `-${headerH}px 0px 0px 0px`, threshold: 0.25 });
if (hero) heroObserver.observe(hero);

// Observe themed sections to flip text color when header is solid
let activeTheme = 'light';
const themeObserver = new IntersectionObserver((entries) => {
  // Find the most visible section
  let best = entries.sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!best) return;
  const theme = best.target.dataset.theme || 'light';
  activeTheme = theme;
  if (!header.classList.contains('blend')){
    header.classList.toggle('theme-dark', theme === 'dark');
    header.classList.toggle('theme-light', theme !== 'dark');
  }
}, { rootMargin: `-${headerH}px 0px 0px 0px`, threshold: [0.15, 0.5, 0.9] });
$$('section[data-theme]').forEach(sec => themeObserver.observe(sec));

// Parallax + hero text fade on scroll
let ticking = false;
const heroImg = $('#hero-img');
const heroContent = $('.hero-content');
function onScroll(){
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY || window.pageYOffset;
    if (heroImg){
      const speed = 0.18;
      heroImg.style.transform = `translateY(${y * speed}px) scale(${1.08 + y/10000})`;
    }
    if (heroContent){
      const h = window.innerHeight || 800;
      const p = Math.min(1, y / (h * 0.6));
      heroContent.style.opacity = String(1 - p * 0.9);
      heroContent.style.transform = `translateY(${p * -16}px)`;
    }
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

// Newsletter demo
const form = $('[data-newsletter]');
if (form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('.form-msg', form);
    if (msg){ msg.hidden = false; msg.textContent = 'Danke für deine Anmeldung!'; }
    form.reset();
  });
}
