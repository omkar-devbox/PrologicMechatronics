import { initSharedNavigation } from '../../assets/js/nav';

interface NewsItemDetails {
  title: string;
  category: string;
  badge: string;
  categoryColor: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  location?: string;
  image: string;
  fullContent: string;
  highlights: string[];
}

const newsData: Record<string, NewsItemDetails> = {
  'auto-expo-2026': {
    title: 'Showcasing Next-Gen EMS Monorails & IoT Solutions at Automation Expo 2026',
    category: 'events',
    badge: 'Upcoming Expo',
    categoryColor: 'bg-[#008BD2]',
    date: 'March 24, 2026',
    readTime: '4 min read',
    author: 'Dayanand Dalvi',
    authorRole: 'Managing Director',
    authorAvatar: '/images/about-us/leadership/director-dayanand-dalvi.png',
    location: 'Pune International Exhibition Centre, MIDC',
    image: '/images/home/capabilities/hero-factory-hd.jpg',
    fullContent: `Prologic Mechatronics is proud to announce its participation at the prestigious Automation Expo 2026. At Stall B-42, our team of seasoned automation engineers will exhibit live demonstration models of our next-generation Electric Monorail Systems (EMS) and Electric Bi-rail Systems (EBS).\n\nKey highlights include live integration demonstrations of IoT-enabled edge gateways collecting operational vibration, motor current, and thermal telemetry, feeding directly into cloud-based SCADA predictive maintenance systems.\n\nVisitors will also get hands-on access to engineering layouts, simulation models of high-bay ASRS stackers, and specialized automotive chassis transfer systems designed specifically for EV body-in-white (BIW) applications.`,
    highlights: [
      'Live running EMS Monorail carrier demo with synchronized vertical lifting',
      'Real-time edge IoT telemetry demonstration with predictive anomaly detection',
      'Direct one-on-one consultations with Senior Project Engineering Directors',
      'Specialized engineering whitepapers and case studies available at the booth'
    ]
  },
  'chakan-expansion': {
    title: 'Prologic Expands Dedicated Heavy Assembly & Testing Line at Kuruli Works, Chakan',
    category: 'company',
    badge: 'Plant Expansion',
    categoryColor: 'bg-[#16A34A]',
    date: 'February 15, 2026',
    readTime: '3 min read',
    author: 'Prologic Works Bureau',
    authorRole: 'Engineering Operations',
    authorAvatar: '/images/common/prologic-header-logo.svg',
    location: 'Kuruli Works, Chakan MIDC, Pune',
    image: '/images/home/capabilities/plant-1-hd.jpg',
    fullContent: `To meet the skyrocketing demand for heavy-duty automotive assembly conveyors and automated logistics lines, Prologic Mechatronics Pvt. Ltd. has completed a massive 25,000 sq.ft. expansion of its dedicated manufacturing and pre-commissioning facility in Kuruli, Chakan.\n\nThe new facility features heavy-duty overhead 20-ton cranes, laser alignment beds, and dedicated pre-commissioning testing bays. This enables full Factory Acceptance Testing (FAT) with actual product payloads before dispatch to OEM sites, dramatically reducing customer on-site commissioning timelines by up to 40%.\n\nWith this milestone, Prologic cements its standing as a turnkey powerhouse capable of executing mega-scale automotive assembly lines simultaneously.`,
    highlights: [
      '25,000 sq.ft. dedicated heavy assembly and pre-commissioning shop floor',
      'Factory Acceptance Testing (FAT) trial bays equipped with 20-ton overhead cranes',
      'Integrated paint shop conveyor and floor slat testing closed loops',
      'Accelerated customer on-site handover timelines by over 40%'
    ]
  },
  'cloud-scada-launch': {
    title: 'Prologic Unveils Smart Cloud SCADA & Real-Time Energy Monitoring Architecture',
    category: 'innovation',
    badge: 'Product Launch',
    categoryColor: 'bg-[#008BD2]',
    date: 'January 28, 2026',
    readTime: '5 min read',
    author: 'Electrical & Controls Team',
    authorRole: 'Systems R&D',
    authorAvatar: '/images/solutions/electrical_control_clean.jpg',
    location: 'Pune Tech Center',
    image: '/images/solutions/electrical_control_clean.jpg',
    fullContent: `Prologic Mechatronics has launched its proprietary Industry 4.0 software layer: Prologic Smart SCADA Cloud. Built specifically for complex overhead monorail loops, floor conveyors, and ASRS warehouse cells, the system brings enterprise IoT connectivity straight to shop floor operations.\n\nThe architecture connects field sensors and PLC systems (Siemens S7-1500, Rockwell ControlLogix, and Mitsubishi iQ-R) with cloud edge compute, providing plant managers with real-time operational cycle times, energy consumption heatmaps, and automated predictive failure alerts.\n\nInitial pilot deployments in commercial vehicle assembly lines showed a 19% reduction in unplanned downtime and a 12% boost in overall conveyor energy efficiency.`,
    highlights: [
      'Multi-vendor PLC protocol support (OPC-UA, MQTT, PROFINET, Ethernet/IP)',
      'Real-time energy consumption dashboards per conveyor carrier',
      'Machine learning models for predictive bearing and motor health',
      'Mobile-responsive alerts and shift performance reports'
    ]
  },
  'mahindra-partnership': {
    title: 'Successful Handover of Turnkey Heavy Cabin Transfer Line for Commercial Vehicle OEM',
    category: 'company',
    badge: 'Project Delivery',
    categoryColor: 'bg-[#16A34A]',
    date: 'December 12, 2025',
    readTime: '3 min read',
    author: 'Project Execution Team',
    authorRole: 'Turnkey Installation',
    authorAvatar: '/images/common/prologic-header-logo.svg',
    location: 'Chakan Industrial Belt',
    image: '/images/solutions/floor_conveyor_clean.jpg',
    fullContent: `Prologic Mechatronics successfully designed, manufactured, installed, and commissioned an end-to-end heavy cabin transfer conveyor line for a leading commercial vehicle manufacturer in Chakan.\n\nThe project spanned 420 meters of precision heavy-duty roller conveyors, 4 electro-hydraulic transfer cars, and integrated vertical lifters capable of 6-ton payload handling with synchronized positioning within +/- 1.0mm.\n\nThe entire installation was executed during a scheduled 10-day annual plant shutdown without disrupting regular vehicle assembly operations.`,
    highlights: [
      'Turnkey delivery: 420 meters heavy-duty automated conveyor line',
      '4 Electro-hydraulic transfer cars with bi-directional indexing',
      'Commissioned within scheduled 10-day annual shutdown window',
      'Zero safety incidents throughout 45,000 man-hours of installation'
    ]
  },
  'esg-summit': {
    title: 'Keynote Address on Sustainable Material Handling at National Logistics Summit',
    category: 'events',
    badge: 'Industry Summit',
    categoryColor: 'bg-[#008BD2]',
    date: 'November 18, 2025',
    readTime: '4 min read',
    author: 'Senior Leadership',
    authorRole: 'Engineering Directorate',
    authorAvatar: '/images/about-us/leadership/director-dayanand-dalvi.png',
    location: 'JW Marriott, Pune',
    image: '/images/solutions/asrs_systems_clean.jpg',
    fullContent: `Prologic Mechatronics senior engineering leadership presented the keynote address at the National Industrial Logistics & Warehousing Summit on the theme of "Engineering Carbon-Efficient Material Handling Networks".\n\nThe presentation showcased real-world data from Prologic installations showing up to 31% reductions in lifecycle electrical consumption through the deployment of regenerative vertical lifters, IE4 super-premium efficiency gearmotors, and smart intermittent-run conveyor logic.\n\nThe session was attended by more than 120 senior plant directors, logistics heads, and automation leaders from across India.`,
    highlights: [
      'Keynote presented by Prologic Senior Engineering Leadership',
      'Demonstrated 31% lifetime energy reduction with IE4 drives',
      'Regenerative braking integration in heavy vertical lifters',
      'Interactive Q&A session with 120+ manufacturing plant heads'
    ]
  },
  'safety-award-2025': {
    title: 'Prologic Receives Zero-Accident Operational Safety Excellence Award from Council',
    category: 'awards',
    badge: 'Safety Honor',
    categoryColor: 'bg-[#16A34A]',
    date: 'October 05, 2025',
    readTime: '2 min read',
    author: 'Safety Directorate',
    authorRole: 'HSE Committee',
    authorAvatar: '/images/common/prologic-header-logo.svg',
    location: 'Maharashtra Safety Council',
    image: '/images/home/capabilities/plant-2-hd.jpg',
    fullContent: `Prologic Mechatronics Pvt. Ltd. was recognized with the prestigious Safety Excellence Award by the Industrial Safety Council of Maharashtra for recording 1,000,000 continuous safe man-hours across manufacturing works and field installation sites.\n\nStrict adherence to safety interlocking, fail-safe pneumatic braking systems, and rigorous on-site erection protocols have made Prologic a benchmark for safety in industrial automation.\n\nFounder & MD Mr. Dayanand Dalvi thanked the entire engineering and site commissioning workforce for their unwavering commitment to zero harm.`,
    highlights: [
      '1,000,000 continuous safe man-hours milestone achieved',
      'Rigorous ISO 45001 compliant site erection and safety guidelines',
      'Engineered safety interlocks on all vertical lifters and monorail switch tracks',
      'Dedicated safety officer oversight across all commissioning sites'
    ]
  }
};

/* ==========================================================================
   Bidirectional Scroll Text & Element Load / Unload Animation System
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

document.addEventListener('DOMContentLoaded', () => {
  // Initialize shared navigation for News & Events page
  initSharedNavigation('news-events');

  // Navbar Scroll Handler
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

  // News Filtering & Search System
  const tabBtns = document.querySelectorAll<HTMLButtonElement>('.news-tab-btn');
  const newsCards = document.querySelectorAll<HTMLElement>('.news-card-item');
  const searchInput = document.getElementById('news-search-input') as HTMLInputElement | null;
  const articlesCount = document.getElementById('articles-count');

  let activeFilter = 'all';
  let searchQuery = '';

  function applyFilters(): void {
    let visibleCount = 0;
    const query = searchQuery.toLowerCase().trim();

    newsCards.forEach((card) => {
      const category = card.getAttribute('data-category') || '';
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const excerpt = (card.getAttribute('data-excerpt') || '').toLowerCase();
      const location = (card.getAttribute('data-location') || '').toLowerCase();

      const matchesCategory = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = !query || title.includes(query) || excerpt.includes(query) || location.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (articlesCount) {
      articlesCount.textContent = visibleCount.toString();
    }
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      applyFilters();
    });
  }

  // Modal Article Details System
  const modal = document.getElementById('news-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalImage = document.getElementById('modal-image') as HTMLImageElement | null;
  const modalBadge = document.getElementById('modal-badge');
  const modalDate = document.getElementById('modal-date');
  const modalLocation = document.getElementById('modal-location');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const modalHighlights = document.getElementById('modal-highlights');

  function openNewsModal(newsId: string): void {
    const item = newsData[newsId];
    if (!item || !modal) return;

    if (modalImage) modalImage.src = item.image;
    if (modalBadge) {
      modalBadge.textContent = item.badge;
      modalBadge.className = `text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${item.categoryColor}`;
    }
    if (modalDate) modalDate.textContent = item.date;
    if (modalLocation) modalLocation.textContent = item.location || 'Pune, India';
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalContent) {
      modalContent.innerHTML = item.fullContent
        .split('\n\n')
        .map((p) => `<p class="mb-3">${p}</p>`)
        .join('');
    }
    if (modalHighlights) {
      modalHighlights.innerHTML = item.highlights
        .map(
          (h) => `
          <li class="flex items-start gap-2.5 text-xs sm:text-sm text-[#101044] font-medium">
            <span class="text-[#16A34A] font-bold mt-0.5">✔</span>
            <span>${h}</span>
          </li>
        `
        )
        .join('');
    }

    modal.classList.add('is-open');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeNewsModal(): void {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Attach modal trigger buttons
  document.querySelectorAll<HTMLElement>('[data-news-id]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const id = trigger.getAttribute('data-news-id');
      if (id) openNewsModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeNewsModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeNewsModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeNewsModal();
    }
  });

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
