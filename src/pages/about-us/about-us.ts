import { initSharedNavigation } from '../../assets/js/nav';

/* ==========================================================================
   Bidirectional Scroll Text & Element Load / Unload Animation System (Home Match)
   ========================================================================== */
function initScrollLoadUnload(): void {
  const elements = document.querySelectorAll<HTMLElement>(
    '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-heading, .scroll-subtext, .scroll-badge, .scroll-mask-wrap'
  );
  if (elements.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => el.classList.add('is-loaded'));
    return;
  }

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        el.classList.add('is-loaded');
      } else {
        el.classList.remove('is-loaded');
      }
    });
  }, observerOptions);

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Animated Number Counters (Triggered on Scroll View)
   ========================================================================== */
function initStatCounters(): void {
  const statNumbers = document.querySelectorAll<HTMLElement>('.stat-count');
  if (statNumbers.length === 0) return;

  const countedSet = new WeakSet<HTMLElement>();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const stat = entry.target as HTMLElement;
      if (entry.isIntersecting && !countedSet.has(stat)) {
        countedSet.add(stat);
        const target = parseInt(stat.getAttribute('data-target') || '0', 10);
        const suffix = stat.getAttribute('data-suffix') || '';
        const prefix = stat.getAttribute('data-prefix') || '';
        let count = 0;
        const speed = 25;
        const step = Math.max(1, Math.ceil(target / 40));

        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            stat.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            clearInterval(timer);
          } else {
            stat.textContent = `${prefix}${count.toLocaleString()}${suffix}`;
          }
        }, speed);
      }
    });
  }, { threshold: 0.2 });

  statNumbers.forEach(stat => observer.observe(stat));
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize shared navigation for About Us page
  initSharedNavigation('about-us');

  // Navbar Scroll Handler (Exact Match to Home Page main.ts)
  const navEl = document.getElementById('techno-navbar');
  if (navEl) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        navEl.classList.add('navbar-scrolled');
      } else {
        navEl.classList.remove('navbar-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Initialize Home-style Bidirectional Scroll Animation System
  initScrollLoadUnload();

  // Initialize Animated Statistics Counters
  initStatCounters();

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
});
