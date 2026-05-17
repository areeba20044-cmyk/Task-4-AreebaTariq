/* ==========================================
   BAHRIA LIVING – script.js
   Custom cursor · Loader · Nav scroll
   Hero 3D tilt · Counter · Slider · Filter
   Reveal on scroll · 3D about card
   Contact form validation
========================================== */

// ==========================================
//  LOADER
// ==========================================
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  let pct = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) { pct = 100; clearInterval(interval); }
    fill.style.width = pct + '%';
    if (pct === 100) {
      setTimeout(() => {
        loader.classList.add('gone');
        document.body.style.overflow = 'auto';
        startCounters();
      }, 400);
    }
  }, 80);

  document.body.style.overflow = 'hidden';
})();


// ==========================================
//  NAV SCROLL EFFECT
// ==========================================
(function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
  });

  document.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


// ==========================================
//  CUSTOM CURSOR
// ==========================================
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
    // Follower trails
    setTimeout(() => {
      follower.style.left = mouseX + 'px';
      follower.style.top  = mouseY + 'px';
    }, 80);
  });

  // Expand on interactive elements
  document.querySelectorAll('a, button, .prop-card, .agent-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width  = '60px';
      follower.style.height = '60px';
      follower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.opacity = '0.6';
    });
  });
})();


// ==========================================
//  HERO 3D TILT (mouse parallax)
// ==========================================
(function initHeroTilt() {
  const card = document.getElementById('heroCard');
  if (!card) return;

  let raf;
  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    targetX = ((e.clientY - cy) / cy) * 6;   // tilt X
    targetY = ((e.clientX - cx) / cx) * -6;  // tilt Y
  });

  function animate() {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    card.style.transform =
      `perspective(900px) rotateX(${curX}deg) rotateY(${curY}deg)`;
    raf = requestAnimationFrame(animate);
  }
  animate();

  document.querySelector('.hero')?.addEventListener('mouseleave', () => {
    targetX = 0; targetY = 0;
  });
})();


// ==========================================
//  ABOUT 3D CARD TILT
// ==========================================
(function initAboutTilt() {
  const card = document.getElementById('about3dCard');
  if (!card) return;
  const inner = card.querySelector('.a3d-inner');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    inner.style.transform =
      `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)';
    inner.style.transition = 'transform 0.6s ease';
  });
  card.addEventListener('mouseenter', () => {
    inner.style.transition = 'transform 0.1s ease';
  });
})();


// ==========================================
//  COUNTER ANIMATION
// ==========================================
function startCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    const step  = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}


// ==========================================
//  SCROLL REVEAL
// ==========================================
(function initReveal() {
  const items = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings in a grid
        const delay = (entry.target.dataset.delay || 0) + (
          Array.from(entry.target.parentElement.children)
            .indexOf(entry.target) * 0.1
        );
        entry.target.style.transitionDelay = `${Math.min(delay, 0.5)}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
})();


// ==========================================
//  PROPERTIES SLIDER
// ==========================================
(function initSlider() {
  const slider    = document.getElementById('propSlider');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  const dotsWrap  = document.getElementById('sliderDots');
  if (!slider) return;

  let currentIndex = 0;
  const cards      = () => slider.querySelectorAll('.prop-card:not([style*="display: none"])');
  let visibleCards;

  function getCardWidth() {
    const c = slider.querySelectorAll('.prop-card')[0];
    if (!c) return 340;
    return c.offsetWidth + 28; // card + gap
  }

  function getVisibleCount() {
    const wrap = slider.parentElement;
    const w = wrap.offsetWidth;
    if (w < 500)  return 1;
    if (w < 850)  return 2;
    return 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    visibleCards = slider.querySelectorAll('.prop-card:not([style*="display: none"])');
    const total  = Math.max(0, visibleCards.length - getVisibleCount() + 1);
    for (let i = 0; i < total; i++) {
      const d = document.createElement('div');
      d.className = 'slider-dot-item' + (i === currentIndex ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.slider-dot-item').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    visibleCards = slider.querySelectorAll('.prop-card:not([style*="display: none"])');
    const max    = Math.max(0, visibleCards.length - getVisibleCount());
    currentIndex = Math.max(0, Math.min(index, max));
    slider.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Touch swipe support
  let startX = 0;
  slider.addEventListener('touchstart', (e) => startX = e.touches[0].clientX, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(currentIndex + (diff > 0 ? 1 : -1));
  });

  buildDots();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      currentIndex = 0;

      slider.querySelectorAll('.prop-card').forEach(card => {
        const match = filter === 'all' || card.dataset.city === filter;
        card.style.display  = match ? 'block' : 'none';
        card.style.opacity  = '0';
        card.style.transform = 'translateY(20px) scale(0.97)';
        if (match) {
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0) scale(1)';
          }, 30);
        }
      });

      slider.style.transform = 'translateX(0)';
      setTimeout(buildDots, 60);
    });
  });

  window.addEventListener('resize', () => { buildDots(); goTo(currentIndex); });
})();


// ==========================================
//  CONTACT FORM VALIDATION
// ==========================================
(function initContactForm() {
  const cfSubmit  = document.getElementById('cfSubmit');
  const cfSuccess = document.getElementById('cfSuccess');
  if (!cfSubmit) return;

  function setMsg(id, msgId, type, text) {
    const inp = document.getElementById(id);
    const msg = document.getElementById(msgId);
    if (!inp || !msg) return;
    inp.style.borderColor = type === 'err'
      ? 'rgba(231,76,60,0.6)'
      : type === 'ok'
      ? 'rgba(80,200,120,0.6)'
      : 'rgba(201,168,76,0.15)';
    msg.className = 'cf-msg ' + (type || '');
    msg.textContent = text;
  }

  // Clear on input
  ['cf-name','cf-phone','cf-email','cf-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      const msgId = id + '-msg';
      const msgEl = document.getElementById(msgId);
      if (msgEl) { msgEl.textContent = ''; msgEl.className = 'cf-msg'; }
      el.style.borderColor = 'rgba(201,168,76,0.15)';
    });
  });

  cfSubmit.addEventListener('click', () => {
    let valid = true;

    const name  = document.getElementById('cf-name')?.value.trim();
    const phone = document.getElementById('cf-phone')?.value.trim();
    const email = document.getElementById('cf-email')?.value.trim();

    if (!name || name.length < 2) {
      setMsg('cf-name', 'cf-name-msg', 'err', '✗ Please enter your full name'); valid = false;
    } else {
      setMsg('cf-name', 'cf-name-msg', 'ok', '✓ Looks good');
    }

    if (!phone || !/^[\d\s\+\-\(\)]{7,15}$/.test(phone)) {
      setMsg('cf-phone', 'cf-phone-msg', 'err', '✗ Enter a valid phone number'); valid = false;
    } else {
      setMsg('cf-phone', 'cf-phone-msg', 'ok', '✓ Valid number');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg('cf-email', 'cf-email-msg', 'err', '✗ Enter a valid email address'); valid = false;
    } else {
      setMsg('cf-email', 'cf-email-msg', 'ok', '✓ Valid email');
    }

    if (valid) {
      cfSubmit.textContent = 'Sending…';
      cfSubmit.disabled = true;
      setTimeout(() => {
        cfSuccess.classList.add('show');
        cfSubmit.textContent = 'Sent! ✓';
        cfSubmit.style.background = 'rgba(80,200,120,0.2)';
        cfSubmit.style.color      = '#50c878';
        cfSubmit.style.border     = '1px solid rgba(80,200,120,0.4)';
      }, 1200);
    }
  });
})();


// ==========================================
//  PARALLAX on hero orbs & floating cards
// ==========================================
(function initParallax() {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const fc1  = document.querySelector('.fc1');
  const fc2  = document.querySelector('.fc2');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (orb1) orb1.style.transform = `translateY(${y * 0.15}px)`;
    if (orb2) orb2.style.transform = `translateY(${y * -0.1}px)`;
    if (fc1)  fc1.style.transform  = `translateY(${y * 0.08}px)`;
    if (fc2)  fc2.style.transform  = `translateY(${y * -0.08}px)`;
  });
})();


// ==========================================
//  PROP CARD 3D TILT (individual cards)
// ==========================================
(function initCardTilt() {
  function applyTilt(card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        `translateY(-12px) scale(1.01) perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease, border-color 0.4s';
    });
  }

  document.querySelectorAll('.prop-card').forEach(applyTilt);
})();


// ==========================================
//  AGENT CARD subtle tilt
// ==========================================
(function initAgentTilt() {
  document.querySelectorAll('.agent-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        `translateY(-10px) perspective(500px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s';
      card.style.transform = '';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease';
    });
  });
})();


// ==========================================
//  MARQUEE pause on hover
// ==========================================
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const strip = document.querySelector('.marquee-strip');
  strip?.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  strip?.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();


// ==========================================
//  ACTIVE NAV LINK on scroll
// ==========================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + current);
    });
  });
})();
