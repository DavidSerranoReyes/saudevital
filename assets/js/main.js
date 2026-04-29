/* =============================================
   SAUDEVITAL – Main JS
   ============================================= */

// ── Navbar on scroll ───────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', onScroll, { passive: true });

// ── Hero logo: scroll parallax ─────────────────
const heroLogo = document.getElementById('heroLogo');

function onScroll() {
  const y = window.scrollY;

  // Navbar
  navbar.classList.toggle('scrolled', y > 40);

  // Logo parallax: drifts up + fades as user scrolls
  if (heroLogo) {
    const drift  = y * 0.18;
    const fOpacity = Math.max(0, 1 - y / 500);
    heroLogo.style.transform = `translateY(calc(-50% + ${drift}px))`;
    heroLogo.style.opacity   = fOpacity;
  }
}

// ── Hero logo: mouse 3D tilt ───────────────────
const heroSection = document.getElementById('hero');
let tiltRAF = null;

if (heroSection && heroLogo) {
  heroSection.addEventListener('mousemove', e => {
    cancelAnimationFrame(tiltRAF);
    tiltRAF = requestAnimationFrame(() => {
      const rect = heroSection.getBoundingClientRect();
      // Normalized -1 → +1 relative to section center
      const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      const rotX = -ny * 10; // tilt up/down
      const rotY =  nx * 10; // tilt left/right
      const scrollDrift = window.scrollY * 0.18;

      heroLogo.style.transform =
        `translateY(calc(-50% + ${scrollDrift}px)) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    const scrollDrift = window.scrollY * 0.18;
    heroLogo.style.transition = 'transform 0.8s cubic-bezier(.16,1,.3,1)';
    heroLogo.style.transform  = `translateY(calc(-50% + ${scrollDrift}px))`;
    setTimeout(() => { heroLogo.style.transition = ''; }, 800);
  });
}

// ── Mobile menu ────────────────────────────────
const burger      = document.getElementById('navBurger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

burger.addEventListener('click',    () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', closeMobile);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

function closeMobile() { mobileMenu.classList.remove('open'); }

// ── Scroll reveal ──────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
    const delay    = Math.min(siblings.indexOf(entry.target) * 80, 400);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Smooth hash scroll ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
