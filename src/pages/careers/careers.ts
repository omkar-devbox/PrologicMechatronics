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
        // Load effect when scrolled into view
        el.classList.add('is-loaded');
      } else {
        // Unload effect when scrolled out of view (Home bidirectional scroll effect)
        el.classList.remove('is-loaded');
      }
    });
  }, observerOptions);

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize shared navigation for Careers page
  initSharedNavigation('careers');

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

  // Job filtering logic
  const deptBtns = document.querySelectorAll<HTMLButtonElement>('.dept-btn');
  const jobCards = document.querySelectorAll<HTMLElement>('.job-card');
  const searchInput = document.getElementById('job-search-input') as HTMLInputElement | null;
  const noJobsFound = document.getElementById('no-jobs-found');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const visibleCountEl = document.getElementById('visible-count');

  let activeDepartment = 'all';
  let currentSearchQuery = '';

  function filterJobs(): void {
    let visibleCount = 0;
    const query = currentSearchQuery.trim().toLowerCase();

    jobCards.forEach(card => {
      const cardDept = (card.getAttribute('data-dept') || '').toLowerCase();
      const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
      const cardText = card.textContent?.toLowerCase() || '';

      const matchesDept = activeDepartment === 'all' || cardDept === activeDepartment.toLowerCase();
      const matchesSearch = query === '' || cardTitle.includes(query) || cardDept.includes(query) || cardText.includes(query);

      if (matchesDept && matchesSearch) {
        card.style.display = 'flex';
        // Re-trigger scroll loaded state when filtered
        card.classList.add('is-loaded');
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCountEl) {
      visibleCountEl.textContent = `${visibleCount} ${visibleCount === 1 ? 'Position' : 'Positions'} Available`;
    }

    if (noJobsFound) {
      if (visibleCount === 0) {
        noJobsFound.classList.remove('hidden');
      } else {
        noJobsFound.classList.add('hidden');
      }
    }
  }

  // Department filter button click handling
  deptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deptBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
      });

      btn.classList.add('active');
      btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');

      activeDepartment = btn.getAttribute('data-dept') || 'all';
      filterJobs();
    });
  });

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearchQuery = searchInput.value;
      filterJobs();
    });
  }

  // Reset filters button
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      activeDepartment = 'all';
      currentSearchQuery = '';
      if (searchInput) searchInput.value = '';

      deptBtns.forEach(b => {
        const isAll = (b.getAttribute('data-dept') || '') === 'all';
        if (isAll) {
          b.classList.add('active');
          b.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
        } else {
          b.classList.remove('active');
          b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
        }
      });

      filterJobs();
    });
  }

  // Dropzone file name display handler for on-page form
  const fileInput = document.getElementById('post-resume-file') as HTMLInputElement | null;
  const fileNameDisplay = document.getElementById('file-chosen-name');
  if (fileInput && fileNameDisplay) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name}`;
        fileNameDisplay.classList.remove('hidden');
      } else {
        fileNameDisplay.classList.add('hidden');
      }
    });
  }

  // On-page Post Resume Form Submission
  const postResumeForm = document.getElementById('post-resume-form') as HTMLFormElement | null;
  const applicationToast = document.getElementById('application-toast');

  if (postResumeForm) {
    postResumeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      postResumeForm.reset();
      if (fileNameDisplay) fileNameDisplay.classList.add('hidden');

      if (applicationToast) {
        applicationToast.classList.remove('hidden');
        setTimeout(() => {
          applicationToast.classList.add('hidden');
        }, 5500);
      }
    });
  }

  // Quick Apply Modal Elements
  const applyBtns = document.querySelectorAll<HTMLButtonElement>('.apply-btn');
  const modal = document.getElementById('apply-modal');
  const modalRole = document.getElementById('modal-role-name');
  const modalPostSelect = document.getElementById('modal-post-applying') as HTMLSelectElement | null;
  const modalClose = document.getElementById('modal-close-btn');
  const modalApplyForm = document.getElementById('career-apply-form') as HTMLFormElement | null;

  function openModal(role: string): void {
    if (modalRole) modalRole.textContent = role;
    if (modalPostSelect) {
      for (let i = 0; i < modalPostSelect.options.length; i++) {
        if (role.toLowerCase().includes(modalPostSelect.options[i].value.toLowerCase())) {
          modalPostSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(): void {
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  applyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const role = btn.getAttribute('data-role') || 'Design Engineer';
      openModal(role);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (modalApplyForm) {
    modalApplyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      modalApplyForm.reset();

      if (applicationToast) {
        applicationToast.classList.remove('hidden');
        setTimeout(() => {
          applicationToast.classList.add('hidden');
        }, 5500);
      }
    });
  }
});
