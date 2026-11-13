export function initSharedNavigation(currentPage?: string) {
  const setup = () => {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
      const iconPath = btn.querySelector('svg path');
      const hamburgerD = 'M4 6h16M4 12h16M4 18h16';
      const closeD = 'M6 18L18 6M6 6l12 12';

      const openMenu = () => {
        menu.classList.remove('hidden');
        btn.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        if (iconPath) iconPath.setAttribute('d', closeD);
      };

      const closeMenu = () => {
        menu.classList.add('hidden');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        if (iconPath) iconPath.setAttribute('d', hamburgerD);
      };

      const toggleMenu = (e?: Event) => {
        if (e) e.stopPropagation();
        const isOpen = !menu.classList.contains('hidden');
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      };

      // Direct assignment prevents duplicate event listener stacking
      btn.onclick = toggleMenu;

      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          closeMenu();
        });
      });

      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target as Node) && !btn.contains(e.target as Node)) {
          closeMenu();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
          closeMenu();
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
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
}

