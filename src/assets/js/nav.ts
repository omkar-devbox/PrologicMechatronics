export function initSharedNavigation(currentPage?: string) {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', (!isExpanded).toString());
      menu.classList.toggle('hidden');
      btn.classList.toggle('is-open');
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('is-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target as Node) && !btn.contains(e.target as Node)) {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('is-open');
      }
    });
  }

  if (currentPage) {
    document.querySelectorAll(`[data-page="${currentPage}"]`).forEach((el) => {
      el.setAttribute('aria-current', 'page');
    });
  }

  const header = document.querySelector('header');
  if (header) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 20) {
          header.classList.add('shadow-lg', 'shadow-black/20', 'bg-slate-950/95');
          header.classList.remove('bg-slate-950/80');
        } else {
          header.classList.remove('shadow-lg', 'shadow-black/20', 'bg-slate-950/95');
          header.classList.add('bg-slate-950/80');
        }
      },
      { passive: true }
    );
  }

  const nav = document.getElementById('techno-navbar');
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        nav.classList.add('navbar-scrolled');
      } else {
        nav.classList.remove('navbar-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}

