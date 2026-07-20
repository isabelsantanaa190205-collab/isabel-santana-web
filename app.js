/* ==========================================================================
   app.js — Lenis (smooth scroll) + GSAP (hero only) + IntersectionObserver
   ========================================================================== */

// ─── 1. CURRENT YEAR ────────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ─── 2. NAVBAR SCROLL ───────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── 3. MOBILE NAV ──────────────────────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const mobileNav    = document.getElementById('mobileNav');
const mobileClose  = document.getElementById('mobileNavClose');

function toggleNav(force) {
    const open = typeof force === 'boolean' ? force : !mobileNav.classList.contains('active');
    mobileNav.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleNav());
mobileClose.addEventListener('click', () => toggleNav(false));
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => toggleNav(false)));

// ─── 4. SMOOTH ANCHOR SCROLL ────────────────────────────────────────────────
function smoothScrollTo(target) {
    const el = document.querySelector(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight;
    if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -navbar.offsetHeight });
    } else {
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        e.preventDefault();
        smoothScrollTo(id);
    });
});

// ─── 5. LENIS SMOOTH SCROLL (only if library loaded) ────────────────────────
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
    });
    window.lenis = lenis;

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// ─── 6. GSAP HERO ANIMATION (only if library loaded) ────────────────────────
if (typeof gsap !== 'undefined') {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero .badge',   { y: 28, opacity: 0, duration: 0.8 })
        .from('.hero h1',       { y: 50, opacity: 0, duration: 1   }, '-=0.4')
        .from('.hero-subtitle', { y: 38, opacity: 0, duration: 0.9 }, '-=0.5')
        .from('.hero-cta',      { y: 28, opacity: 0, duration: 0.8 }, '-=0.4');
}

// ─── 7. INTERSECTION OBSERVER — reveal on scroll ────────────────────────────
// These elements start hidden (via CSS) and get revealed as they scroll in.
const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-stagger > *'
);

const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => io.observe(el));

// ─── 8. ACCORDION ────────────────────────────────────────────────────────────
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const body = item.querySelector('.accordion-body');
        const isActive = item.classList.contains('active');

        // close all
        document.querySelectorAll('.accordion-item').forEach(other => {
            other.classList.remove('active');
            other.querySelector('.accordion-body').style.maxHeight = null;
        });

        // open clicked
        if (!isActive) {
            item.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    });
});
