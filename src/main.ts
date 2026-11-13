import './style.css';
import { initSharedNavigation } from './assets/js/nav';

// Initialize Unified Navigation across all viewports
initSharedNavigation('home');

/* ==========================================================================
   3D Fluid / Gas Particle Wave Simulation (Aerodynamic Damper Dynamics)
   ========================================================================== */
function init3DFluidWave() {
  const canvas = document.getElementById('hero-fluid-canvas') as HTMLCanvasElement | null;
  const stage = document.getElementById('hero-stage');
  if (!canvas || !stage) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let width = 0;
  let height = 0;
  let dpr = 1;

  interface Particle {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    baseY: number;
    phase: number;
    size: number;
    color: string;
    glowColor: string;
    alpha: number;
  }

  interface StreamPoint {
    x: number;
    y: number;
    z: number;
    baseY: number;
    phase: number;
    screenX: number;
    screenY: number;
    scale: number;
  }

  interface Streamline {
    baseY: number;
    baseZ: number;
    amplitude: number;
    color: string;
    points: StreamPoint[];
  }

  let particles: Particle[] = [];
  let streamlines: Streamline[] = [];

  const mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    isHovered: false,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0
  };

  const particleColors = [
    { color: 'rgba(56, 189, 248, 0.95)', glow: 'rgba(56, 189, 248, 0.35)' }, // Cyan
    { color: 'rgba(37, 99, 235, 0.9)', glow: 'rgba(37, 99, 235, 0.28)' },     // Electric Blue
    { color: 'rgba(20, 184, 166, 0.9)', glow: 'rgba(20, 184, 166, 0.32)' },  // Marine Teal
    { color: 'rgba(147, 197, 253, 0.95)', glow: 'rgba(147, 197, 253, 0.4)' },// Specular Blue
    { color: 'rgba(255, 255, 255, 0.95)', glow: 'rgba(255, 255, 255, 0.4)' } // Core Highlight
  ];

  const streamGradients = [
    'rgba(56, 189, 248, 0.45)',
    'rgba(20, 184, 166, 0.42)',
    'rgba(37, 99, 235, 0.38)',
    'rgba(96, 165, 250, 0.35)',
    'rgba(45, 212, 191, 0.32)',
    'rgba(147, 197, 253, 0.3)'
  ];

  const initElements = () => {
    particles = [];
    streamlines = [];

    const isMobile = width < 768;
    const particleCount = isMobile ? 80 : 175;
    const streamCount = isMobile ? 4 : 6;

    // Generate 3D fluid particles
    for (let i = 0; i < particleCount; i++) {
      const col = particleColors[Math.floor(Math.random() * particleColors.length)];
      particles.push({
        x: (Math.random() - 0.5) * width * 1.6,
        y: (Math.random() - 0.5) * height * 0.9,
        z: (Math.random() - 0.5) * 600,
        vx: 1.4 + Math.random() * 2.2,
        vy: 0,
        baseY: (Math.random() - 0.5) * height * 0.8,
        phase: Math.random() * Math.PI * 2,
        size: 1.2 + Math.random() * 2.6,
        color: col.color,
        glowColor: col.glow,
        alpha: 0.3 + Math.random() * 0.7
      });
    }

    // Generate 3D aerodynamic streamline paths
    const pointsPerStream = isMobile ? 22 : 36;
    for (let s = 0; s < streamCount; s++) {
      const baseY = ((s / (streamCount - 1)) - 0.5) * height * 0.75;
      const baseZ = ((s / (streamCount - 1)) - 0.5) * 450;
      const points: StreamPoint[] = [];

      for (let p = 0; p < pointsPerStream; p++) {
        const x = ((p / (pointsPerStream - 1)) - 0.5) * width * 1.5;
        points.push({
          x,
          y: baseY,
          z: baseZ,
          baseY,
          phase: (p / pointsPerStream) * Math.PI * 2 + s * 1.2,
          screenX: 0,
          screenY: 0,
          scale: 1
        });
      }

      streamlines.push({
        baseY,
        baseZ,
        amplitude: 34 + s * 9,
        color: streamGradients[s % streamGradients.length],
        points
      });
    }
  };

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (width === 0 || height === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    initElements();
  };

  const handlePointer = (clientX: number, clientY: number) => {
    const rect = stage.getBoundingClientRect();
    mouse.targetX = clientX - rect.left;
    mouse.targetY = clientY - rect.top;
    mouse.isHovered = true;

    mouse.targetTiltX = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
    mouse.targetTiltY = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height) * 2 - 1));
  };

  stage.addEventListener('mousemove', (e: MouseEvent) => handlePointer(e.clientX, e.clientY));
  stage.addEventListener('mouseleave', () => {
    mouse.isHovered = false;
    mouse.targetX = -9999;
    mouse.targetY = -9999;
    mouse.targetTiltX = 0;
    mouse.targetTiltY = 0;
  });

  stage.addEventListener('touchmove', (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    mouse.isHovered = false;
    mouse.targetX = -9999;
    mouse.targetY = -9999;
    mouse.targetTiltX = 0;
    mouse.targetTiltY = 0;
  });

  // Gyroscope tilt support on mobile
  if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
    window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
      if (!mouse.isHovered && e.gamma !== null && e.beta !== null) {
        mouse.targetTiltX = Math.max(-1, Math.min(1, e.gamma / 35));
        mouse.targetTiltY = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
      }
    }, { passive: true });
  }

  window.addEventListener('resize', resize);
  resize();

  // Performance: Pause simulation when scrolled out of view
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(stage);

  let time = 0;
  let animId: number;

  const render = () => {
    if (!isVisible) {
      animId = requestAnimationFrame(render);
      return;
    }

    time += 0.014;

    // Smooth inertia lerping
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;
    mouse.tiltX += (mouse.targetTiltX - mouse.tiltX) * 0.06;
    mouse.tiltY += (mouse.targetTiltY - mouse.tiltY) * 0.06;

    // Update Stage CSS custom properties for 3D card & background parallax
    stage.style.setProperty('--tilt-x', mouse.tiltX.toFixed(4));
    stage.style.setProperty('--tilt-y', mouse.tiltY.toFixed(4));
    stage.style.setProperty('--bg-x', `${(-mouse.tiltX * 28).toFixed(2)}px`);
    stage.style.setProperty('--bg-y', `${(-mouse.tiltY * 20).toFixed(2)}px`);

    const spotlightX = mouse.isHovered ? (mouse.x / width) * 100 : 50;
    const spotlightY = mouse.isHovered ? (mouse.y / height) * 100 : 50;
    stage.style.setProperty('--mouse-px', `${Math.max(0, Math.min(100, spotlightX)).toFixed(2)}%`);
    stage.style.setProperty('--mouse-py', `${Math.max(0, Math.min(100, spotlightY)).toFixed(2)}%`);

    ctx.clearRect(0, 0, width, height);

    // 3D Camera Angles
    const camPitch = mouse.tiltY * 0.22;
    const camYaw = mouse.tiltX * 0.32;
    const cosX = Math.cos(camPitch);
    const sinX = Math.sin(camPitch);
    const cosY = Math.cos(camYaw);
    const sinY = Math.sin(camYaw);

    const fov = 650;
    const centerX = width / 2;
    const centerY = height / 2;

    const project = (x: number, y: number, z: number) => {
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = fov / Math.max(10, fov + z2 + 300);
      return {
        screenX: centerX + x1 * scale,
        screenY: centerY + y2 * scale,
        scale,
        depth: z2
      };
    };

    // 1. Render Aerodynamic Streamline Ribbons
    ctx.lineWidth = 1.6;
    for (let s = 0; s < streamlines.length; s++) {
      const stream = streamlines[s];
      const pts = stream.points;

      for (let p = 0; p < pts.length; p++) {
        const pt = pts[p];
        const wave = Math.sin(pt.x * 0.0035 + time * 1.8 + pt.phase) * stream.amplitude
          + Math.cos(pt.z * 0.004 + time * 1.2) * (stream.amplitude * 0.45);
        let curY = pt.baseY + wave;
        const curX = pt.x;

        // Interactive mouse deflection
        const projTemp = project(curX, curY, pt.z);
        if (mouse.isHovered) {
          const dx = projTemp.screenX - mouse.x;
          const dy = projTemp.screenY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const deflectRadius = 180;
          if (dist < deflectRadius) {
            const force = (1 - dist / deflectRadius) * 45;
            curY += (dy / (dist || 1)) * force;
          }
        }

        const proj = project(curX, curY, pt.z);
        pt.screenX = proj.screenX;
        pt.screenY = proj.screenY;
        pt.scale = proj.scale;
      }

      if (pts.length > 2) {
        ctx.beginPath();
        ctx.strokeStyle = stream.color;
        ctx.moveTo(pts[0].screenX, pts[0].screenY);

        for (let p = 1; p < pts.length - 1; p++) {
          const xc = (pts[p].screenX + pts[p + 1].screenX) / 2;
          const yc = (pts[p].screenY + pts[p + 1].screenY) / 2;
          ctx.quadraticCurveTo(pts[p].screenX, pts[p].screenY, xc, yc);
        }
        ctx.stroke();

        // Node markers
        for (let p = 0; p < pts.length; p += 3) {
          const pt = pts[p];
          if (pt.scale > 0.4) {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
            ctx.beginPath();
            ctx.arc(pt.screenX, pt.screenY, 1.8 * pt.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 2. Render 3D Fluid Particles
    const boundX = width * 0.85;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      if (p.x > boundX) {
        p.x = -boundX;
        p.y = p.baseY;
      }

      const waveY = Math.sin(p.x * 0.004 + time * 2.2 + p.phase) * 28
        + Math.cos(p.z * 0.005 + time) * 16;
      const targetY = p.baseY + waveY;

      // Mouse interactive fluid vortex
      const projCurrent = project(p.x, targetY, p.z);
      if (mouse.isHovered) {
        const dx = projCurrent.screenX - mouse.x;
        const dy = projCurrent.screenY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 170;
        if (dist < radius) {
          const force = (1 - dist / radius) * 45;
          p.vy += (dy / (dist || 1)) * force * 0.08;
          p.vx += (dx / (dist || 1)) * force * 0.04;
        }
      }

      p.vy *= 0.92;
      p.vx += (2.0 - p.vx) * 0.04;

      const finalY = targetY + p.vy * 8;
      const proj = project(p.x, finalY, p.z);

      if (proj.scale > 0.15) {
        const rad = Math.max(0.6, p.size * proj.scale);
        const alpha = Math.min(1, Math.max(0.1, p.alpha * proj.scale));

        if (rad > 2.0) {
          ctx.beginPath();
          ctx.fillStyle = p.glowColor;
          ctx.arc(proj.screenX, proj.screenY, rad * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.arc(proj.screenX, proj.screenY, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    animId = requestAnimationFrame(render);
  };

  animId = requestAnimationFrame(render);

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animId);
    observer.disconnect();
  });
}

/* ==========================================================================
   Technorithm Hero Typewriter Effect
   ========================================================================== */
function initHeroTypewriter() {
  const target = document.getElementById('hero-typewriter-text');
  if (!target) return;
  const textEl = target;

  const phrases = [
    "Turnkey Automation & Material Handling Systems",
    "Special Purpose Machines (SPMs) for Automotive, Logistics & Food Industry",
    "Floor Conveyors, EMS Systems, Overhead Conveyors, AGVs & ASRS",
    "Industry 4.0 Upgradation & Electrical Control Systems from Concept to Commissioning",
    "Conveying System Spare Parts & AMCs for TCF, Paint Shops & Weld Shops"
  ];

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = true;
  let typingSpeed = 50;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      textEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 25;
    } else {
      textEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 45;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2400; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 2000);
}

/* ==========================================================================
   Technorithm / Pill Navbar Scroll Effect
   ========================================================================== */
function initNavbarScroll() {
  const nav = document.getElementById('techno-navbar');
  if (!nav) return;
  const navEl = nav;

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


/* ==========================================================================
   Technorithm Interactive Testimonial Carousel Slider
   ========================================================================== */
function initTestimonialSlider() {
  const trackEl = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('testimonial-prev-btn');
  const nextBtn = document.getElementById('testimonial-next-btn');
  const dotsEl = document.getElementById('testimonial-dots');
  if (!trackEl || !prevBtn || !nextBtn || !dotsEl) return;
  const track = trackEl;
  const dotsContainer = dotsEl;

  const slides = Array.from(track.children) as HTMLElement[];
  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer: number | null = null;

  function getVisibleCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, slides.length - getVisibleCount());
  }

  function updateSlider() {
    const visibleCount = getVisibleCount();
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const slideWidthPercent = 100 / visibleCount;
    slides.forEach((slide) => {
      slide.style.width = `${slideWidthPercent}%`;
      slide.style.flexShrink = '0';
    });

    const offset = currentIndex * slideWidthPercent;
    track.style.transform = `translateX(-${offset}%)`;

    // Render pagination dots
    dotsContainer.innerHTML = '';
    const totalDots = maxIndex + 1;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      dot.className = i === currentIndex
        ? 'rounded-full transition-all duration-500 ease-out bg-[#EE6226] w-8 h-2.5 cursor-pointer'
        : 'rounded-full transition-all duration-500 ease-out bg-gray-300 w-2.5 h-2.5 hover:bg-gray-400 cursor-pointer';
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function nextSlide() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateSlider();
  }

  function prevSlide() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateSlider();
  }

  function resetAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = window.setInterval(nextSlide, 4500);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  track.addEventListener('mouseenter', () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  });
  track.addEventListener('mouseleave', () => {
    resetAutoPlay();
  });

  window.addEventListener('resize', () => {
    updateSlider();
  });

  updateSlider();
  resetAutoPlay();
}

/* ==========================================================================
   Bidirectional Scroll Text & Element Load / Unload Animation System
   ========================================================================== */
function initScrollLoadUnload() {
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
    rootMargin: '0px 0px 80px 0px',
    threshold: 0.02
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        // Load effect when scrolled into view
        el.classList.add('is-loaded');
        // Keep loaded to avoid white blank screen flashing when scrolling on mobile
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Scroll Progress Indicator, Back-to-Top Button & Anchor Smooth Scrolling
   ========================================================================== */
function initScrollEnhancements() {
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  const onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar width
    if (progressBar && docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      progressBar.style.width = `${progress}%`;
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Handle all in-page anchor links for seamless smooth scrolling with proper navbar offset
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;

      const targetEl = document.querySelector<HTMLElement>(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = 90;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      }
    });
  });
}

/* ==========================================================================
   Industries We Serve - Interactive Sector Dossier Controller
   ========================================================================== */
function initIndustriesDossier() {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.sector-tab-btn');
  const panels = document.querySelectorAll<HTMLElement>('.sector-dossier-panel');

  if (tabs.length === 0 || panels.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetSector = tab.getAttribute('data-sector');
      if (!targetSector) return;

      // Update Tab States
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      // Update Panel States with smooth transition
      panels.forEach((panel) => {
        if (panel.id === `dossier-${targetSector}`) {
          panel.classList.add('is-active');
        } else {
          panel.classList.remove('is-active');
        }
      });
    });
  });
}

/* ==========================================================================
   Continuous Right-to-Left "Direct Sector Index" Carousel Controller
   ========================================================================== */
function initSectorMatrixCarousel() {
  const viewport = document.getElementById('sector-carousel-viewport');
  const track = document.getElementById('sector-carousel-track');
  const prevBtn = document.getElementById('sector-carousel-prev');
  const nextBtn = document.getElementById('sector-carousel-next');

  if (!viewport || !track) return;
  const trackEl = track;

  const cards = trackEl.querySelectorAll<HTMLElement>('.sector-matrix-card');
  if (cards.length === 0) return;

  // Manual navigation buttons (prev / next)
  let manualOffset = 0;
  let resumeTimer: number | null = null;

  function triggerManualShift(direction: 'next' | 'prev') {
    const cardWidth = (cards[0] as HTMLElement).offsetWidth + 24; // card width + gap
    trackEl.classList.add('is-paused');

    // Get current computed transform translateX if in CSS animation
    const style = window.getComputedStyle(trackEl);
    const matrix = new DOMMatrixReadOnly(style.transform);
    if (!manualOffset && matrix.m41 !== 0) {
      manualOffset = matrix.m41;
    }

    if (direction === 'next') {
      manualOffset -= cardWidth;
    } else {
      manualOffset += cardWidth;
    }

    // Boundary check for loop
    const halfWidth = trackEl.scrollWidth / 2;
    if (Math.abs(manualOffset) >= halfWidth) {
      manualOffset = 0;
    } else if (manualOffset > 0) {
      manualOffset = -halfWidth + cardWidth;
    }

    trackEl.style.animation = 'none';
    trackEl.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    trackEl.style.transform = `translateX(${manualOffset}px)`;

    if (resumeTimer) window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      // Return to smooth CSS continuous marquee from current position
      const currentShift = manualOffset;
      const progressPercent = (Math.abs(currentShift) % halfWidth) / halfWidth;

      trackEl.style.transition = '';
      trackEl.style.animation = `sectorScrollRightToLeft 55s linear infinite`;
      trackEl.style.animationDelay = `-${55 * progressPercent}s`;
      trackEl.classList.remove('is-paused');
    }, 4500);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerManualShift('prev');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerManualShift('next');
    });
  }

  // Pointer / touch card interaction for mobile devices & desktop click
  cards.forEach((card) => {
    card.addEventListener('pointerenter', () => {
      cards.forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-active');
    });

    card.addEventListener('click', (e) => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && !card.classList.contains('is-active')) {
        e.preventDefault();
        cards.forEach((c) => c.classList.remove('is-active'));
        card.classList.add('is-active');
      }
    });
  });
}

/* ==========================================================================
   Hero Automated Multi-Image & Data Slider Carousel
   ========================================================================== */
function initHeroMultiSlider() {
  const heroSection = document.getElementById('hero-slider-section');
  if (!heroSection) return;

  const bgSlides = heroSection.querySelectorAll<HTMLElement>('.hero-slide-bg');
  const contentSlides = heroSection.querySelectorAll<HTMLElement>('.hero-content-slide');
  const dots = heroSection.querySelectorAll<HTMLButtonElement>('.hero-slider-dot');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');

  if (bgSlides.length === 0 || contentSlides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = Math.min(bgSlides.length, contentSlides.length);
  let slideTimer: ReturnType<typeof setInterval> | null = null;
  const SLIDE_INTERVAL = 5000; // 5 seconds per slide for comfortable mobile reading

  function goToSlide(index: number) {
    currentIndex = (index + totalSlides) % totalSlides;

    // Update Background images
    bgSlides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentIndex);
    });

    // Update Content Data (Headlines, badges, descriptions, CTAs)
    contentSlides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentIndex);
    });

    // Update Dots indicator
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, SLIDE_INTERVAL);
  }

  function stopAutoSlide() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  // Next & Prev button clicks
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      startAutoSlide(); // reset timer on manual action
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      startAutoSlide(); // reset timer on manual action
    });
  }

  // Dot button clicks
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-slide-target') || '0', 10);
      goToSlide(targetIndex);
      startAutoSlide();
    });
  });

  // Pause on user hover over hero section for reading ease
  heroSection.addEventListener('mouseenter', stopAutoSlide);
  heroSection.addEventListener('mouseleave', startAutoSlide);

  // Mobile Touch Swipe Navigation (swiping left goes next, swiping right goes prev)
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
    stopAutoSlide();
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    // Only trigger if horizontal swipe is prominent and larger than vertical scroll
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
    startAutoSlide();
  }, { passive: true });

  // Initialize first slide and start timer
  goToSlide(0);
  startAutoSlide();
}

// Initialize all interactive components
init3DFluidWave();
initHeroTypewriter();
initHeroMultiSlider();
initNavbarScroll();
initTestimonialSlider();
initScrollLoadUnload();
initScrollEnhancements();
initIndustriesDossier();
initSectorMatrixCarousel();
