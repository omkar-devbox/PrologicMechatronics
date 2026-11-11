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

/* ==========================================================================
   Quick Copy Utility for Contact Info (Phone / Email)
   ========================================================================== */
function initCopyButtons(): void {
  const copyButtons = document.querySelectorAll<HTMLButtonElement>('[data-copy]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const tooltip = btn.querySelector('.copy-tooltip');
        if (tooltip) {
          tooltip.classList.add('active');
          setTimeout(() => {
            tooltip.classList.remove('active');
          }, 2000);
        }
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize shared navigation for Contact Us page
  initSharedNavigation('contact-us');

  // Navbar Scroll Handler (Exact Match to Home Page & About Us)
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

  // Initialize Quick Copy Actions
  initCopyButtons();

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

  // Contact / RFQ form submission and validation
  const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
  const statusMsg = document.getElementById('status-message');
  const submitBtn = document.getElementById('rfq-submit-btn') as HTMLButtonElement | null;

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting RFQ...
        `;
      }

      setTimeout(() => {
        if (statusMsg) {
          statusMsg.classList.remove('hidden');
          statusMsg.classList.add('flex');
          statusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          setTimeout(() => {
            statusMsg.classList.add('hidden');
            statusMsg.classList.remove('flex');
          }, 8000);
        }

        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Submit Technical Inquiry</span>
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          `;
        }
      }, 700);
    });
  }
});
