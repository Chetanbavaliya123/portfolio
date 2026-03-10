/* =============================================
   Chetan Bavaliya — Portfolio JavaScript
   Animations, Interactions & Utilities
   ============================================= */

'use strict';

/* ===========================
   1. PARTICLE CANVAS
   =========================== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 80;
  const CONNECTION_DISTANCE = 130;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 142, 247, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticleList() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79, 142, 247, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  initParticleList();
  animate();
  window.addEventListener('resize', () => { resize(); initParticleList(); });
})();


/* ===========================
   2. NAVBAR BEHAVIOR
   =========================== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('.nav-link');

  // Sticky & shadow on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveLink();
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Active link highlight based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
})();


/* ===========================
   3. TYPING EFFECT
   =========================== */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Android Developer',
    'Java Programmer',
    'IT Student (Sem 6)',
    'Firebase Enthusiast',
    'Problem Solver 🚀'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPING_SPEED = 80;
  const DELETE_SPEED = 45;
  const PAUSE_AFTER_TYPE = 1800;
  const PAUSE_BEFORE_DELETE = 300;

  function type() {
    if (isPaused) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = currentPhrase.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, PAUSE_BEFORE_DELETE);
        return;
      }
      setTimeout(type, DELETE_SPEED);
    } else {
      charIndex++;
      el.textContent = currentPhrase.substring(0, charIndex);
      if (charIndex === currentPhrase.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    }
  }

  // Small initial delay
  setTimeout(type, 800);
})();


/* ===========================
   4. SCROLL REVEAL ANIMATIONS
   =========================== */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.1}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
})();


/* ===========================
   5. ANIMATED COUNTER STATS
   =========================== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 1500;
      const start = performance.now();

      function updateCounter(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(updateCounter);
        else el.textContent = target;
      }

      requestAnimationFrame(updateCounter);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ===========================
   6. SKILL BAR ANIMATION
   =========================== */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        // Small delay to let the reveal animation play first
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 300);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ===========================
   7. THEME TOGGLE
   =========================== */
(function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const iconEl = btn ? btn.querySelector('.theme-icon') : null;
  if (!btn || !iconEl) return;

  const html = document.documentElement;
  const STORAGE_KEY = 'cb-portfolio-theme';

  // Load saved preference
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    html.setAttribute('data-theme', saved);
    iconEl.textContent = saved === 'light' ? '🌙' : '☀️';
  }

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    iconEl.textContent = next === 'light' ? '🌙' : '☀️';
    localStorage.setItem(STORAGE_KEY, next);
  });
})();


/* ===========================
   8. SCROLL TO TOP BUTTON
   =========================== */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ===========================
   9. CONTACT FORM VALIDATION
   =========================== */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(field, message) {
    field.el.classList.add('error');
    field.error.textContent = message;
  }

  function clearError(field) {
    field.el.classList.remove('error');
    field.error.textContent = '';
  }

  function validateField(key) {
    const field = fields[key];
    const val = field.el.value.trim();

    if (!val) {
      setError(field, `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`);
      return false;
    }

    if (key === 'email' && !validateEmail(val)) {
      setError(field, 'Please enter a valid email address.');
      return false;
    }

    if (key === 'message' && val.length < 10) {
      setError(field, 'Message should be at least 10 characters.');
      return false;
    }

    clearError(field);
    return true;
  }

  // Live validation on blur
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) validateField(key);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const allValid = Object.keys(fields).map(key => validateField(key)).every(Boolean);

    if (allValid) {
      // Simulate form submission
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Sending...';

      setTimeout(() => {
        form.reset();
        Object.keys(fields).forEach(key => clearError(fields[key]));
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 4000);
      }, 1500);
    }
  });
})();


/* ===========================
   10. SMOOTH SCROLL LINKS
   =========================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();


/* ===========================
   11. PROJECT CARD HOVER TILT
   =========================== */
(function initTiltEffect() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;
      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ===========================
   12. PAGE LOAD PROGRESS
   =========================== */
(function initPageLoad() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; width: 0%;
    background: linear-gradient(90deg, #4f8ef7, #9b59f7);
    z-index: 9999; transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(79,142,247,0.6);
  `;
  document.body.appendChild(bar);

  let width = 0;
  const interval = setInterval(() => {
    width = Math.min(width + Math.random() * 15, 90);
    bar.style.width = width + '%';
  }, 200);

  window.addEventListener('load', () => {
    clearInterval(interval);
    bar.style.width = '100%';
    setTimeout(() => bar.remove(), 400);
  });
})();
// Resume Auto Generation
async function generateResume() {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Chetan Bavaliya", 20, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("B.Tech Information Technology (Semester 6)", 20, 30);
  doc.text("Email: chetanbavaliya420@gmail.com", 20, 38);

  // Line
  doc.line(20, 42, 190, 42);

  // Career Objective
  doc.setFont("helvetica", "bold");
  doc.text("Career Objective", 20, 55);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Motivated Android Developer passionate about building scalable mobile applications and AI-based solutions.",
    20,
    65,
    { maxWidth: 170 }
  );

  // Skills
  doc.setFont("helvetica", "bold");
  doc.text("Technical Skills", 20, 85);
  doc.setFont("helvetica", "normal");
  doc.text("• Java", 25, 95);
  doc.text("• Android Development", 25, 103);
  doc.text("• Firebase & SQLite", 25, 111);
  doc.text("• HTML, CSS, JavaScript", 25, 119);

  // Projects
  doc.setFont("helvetica", "bold");
  doc.text("Projects", 20, 135);
  doc.setFont("helvetica", "normal");

  doc.text("DigiMedVault:", 25, 145);
  doc.text(
    "Digital medical record app with offline access and Firebase integration.",
    30,
    153,
    { maxWidth: 160 }
  );

  doc.text("Canteen App:", 25, 168);
  doc.text(
    "Android-based food ordering app with authentication, cart and checkout system.",
    30,
    176,
    { maxWidth: 160 }
  );

  doc.text("AI in E-commerce:", 25, 190);
  doc.text(
    "Study of recommendation engines similar to Amazon and Flipkart.",
    30,
    198,
    { maxWidth: 160 }
  );

  // Save PDF
  doc.save("Chetan_Bavaliya_Resume.pdf");
}