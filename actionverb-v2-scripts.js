/**
 * ActionVerb Writing V2 — Consolidated Scripts
 * Homepage interactions: nav scroll, reveal animations, countdown,
 * particle systems (nav + footer), character carousel.
 * Hosted on GitHub (IanMCO), loaded via Webflow external script.
 */

// --- SMOOTH SCROLL ---
function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- NAV SCROLL EFFECT ---
(function() {
  const nav = document.getElementById('mainNav');
  const heroEl = document.getElementById('hero');
  if (!nav || !heroEl) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroBottom = heroEl.offsetHeight * 0.85;
    nav.classList.toggle('visible', y > heroBottom);
  });
})();

// --- REVEAL ON SCROLL ---
(function() {
  const observer = new IntersectionObserver((entries) => {    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// --- COUNTDOWN TIMER ---
(function() {
  const ids = ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'];
  const els = ids.map(id => document.getElementById(id));
  if (els.some(e => !e)) return;
  function update() {
    const target = new Date('2026-04-29T00:00:00-05:00').getTime();
    const diff = target - Date.now();
    if (diff <= 0) { els.forEach(e => e.textContent = '00'); return; }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    els[0].textContent = String(days).padStart(2, '0');
    els[1].textContent = String(hours).padStart(2, '0');
    els[2].textContent = String(mins).padStart(2, '0');
    els[3].textContent = String(secs).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
})();
// --- NAV PARTICLE SYSTEM (trickling down from top) ---
(function() {
  const canvas = document.getElementById('nav-particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const navEl = canvas.closest('.nav') || canvas.parentElement;
  let W, H, pts = [];
  const COUNT = 40;
  const hues = [210, 210, 42, 42, 268];
  function resize() {
    const rect = navEl.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
  }
  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -Math.random() * 10;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.baseOpacity = Math.random() * 0.4 + 0.1;
      this.hue = hues[Math.floor(Math.random() * hues.length)] + (Math.random() - 0.5) * 15;
      this.life = Math.random() * 300 + 150;
      this.maxLife = this.life;
      this.flicker = Math.random() * 0.015 + 0.004;
    }    update() {
      this.x += this.speedX + Math.sin(Date.now() * this.flicker) * 0.1;
      this.y += this.speedY;
      this.life--;
      this.opacity = this.baseOpacity * (this.life / this.maxLife);
      if (this.life <= 0 || this.y > H + 10) this.reset(false);
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
    }
    draw() {
      if (this.opacity < 0.01) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 72%, ${this.opacity})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 72%, ${this.opacity * 0.12})`;
      ctx.fill();
    }
  }
  function init() { resize(); pts = []; for (let i = 0; i < COUNT; i++) pts.push(new Particle()); }
  function animate() { ctx.clearRect(0, 0, W, H); pts.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
  init(); animate();
  window.addEventListener('resize', () => { resize(); pts.forEach(p => { if (p.x > W) p.x = Math.random() * W; }); });
})();
// --- FOOTER PARTICLE SYSTEM (rising from bottom, fading up) ---
(function() {
  const canvas = document.getElementById('footer-particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const footerEl = canvas.closest('.footer') || canvas.parentElement;
  let W, H, pts = [];
  const COUNT = 80;
  const hues = [210, 210, 42, 42, 268];
  function resize() {
    const rect = footerEl.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
  }
  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + Math.random() * 20;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = -Math.random() * 0.6 - 0.2;
      this.baseOpacity = Math.random() * 0.5 + 0.15;
      this.hue = hues[Math.floor(Math.random() * hues.length)] + (Math.random() - 0.5) * 15;
      this.life = Math.random() * 500 + 300;
      this.maxLife = this.life;
      this.flicker = Math.random() * 0.015 + 0.004;
    }    update() {
      this.x += this.speedX + Math.sin(Date.now() * this.flicker) * 0.15;
      this.y += this.speedY;
      this.life--;
      this.opacity = this.baseOpacity * (this.life / this.maxLife);
      if (this.life <= 0 || this.y < -20) this.reset(false);
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
    }
    draw() {
      if (this.opacity < 0.01) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 72%, ${this.opacity})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 72%, ${this.opacity * 0.12})`;
      ctx.fill();
    }
  }
  function init() { resize(); pts = []; for (let i = 0; i < COUNT; i++) pts.push(new Particle()); }
  function animate() { ctx.clearRect(0, 0, W, H); pts.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
  init(); animate();
  window.addEventListener('resize', () => { resize(); pts.forEach(p => { if (p.x > W) p.x = Math.random() * W; }); });
})();
// --- PARALLAX ON HERO LAYERS ---
(function() {
  const layers = document.querySelectorAll('[data-parallax-speed]');
  if (!layers.length) return;
  function update() {
    const y = window.scrollY;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    if (y > hero.offsetHeight * 1.2) return;
    layers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-parallax-speed'));
      const needsCenterX = layer.classList.contains('hero-layer-jack') || layer.classList.contains('hero-layer-wordmark');
      layer.style.transform = needsCenterX
        ? `translateX(-50%) translateY(${y * speed}px)`
        : `translateY(${y * speed}px)`;
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// --- SECTION TEXTURE PARALLAX ---
(function() {
  const layers = document.querySelectorAll('[data-section-parallax]');
  if (!layers.length) return;
  function update() {
    const viewH = window.innerHeight;
    layers.forEach(layer => {      const section = layer.parentElement;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > viewH + 200) return;
      const speed = parseFloat(layer.getAttribute('data-section-parallax'));
      const offset = (rect.top + rect.height / 2 - viewH / 2) * speed;
      layer.style.transform = `translateY(${offset}px)`;
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// --- CHARACTER SELECTOR CAROUSEL ---
(function() {
  const charSlots = document.querySelectorAll('.char-slot');
  if (!charSlots.length) return;
  const charGlow = document.querySelector('.char-glow');
  const positions = ['left', 'center', 'right'];
  let charOrder = ['hannah', 'jack', 'sam'];
  function applyPositions() {
    charSlots.forEach(slot => {
      const charName = slot.getAttribute('data-char');
      const idx = charOrder.indexOf(charName);
      if (idx >= 0) slot.setAttribute('data-position', positions[idx]);
    });
    if (charGlow) charGlow.setAttribute('data-active', charOrder[1]);
  }
  function rotate(dir) {
    charOrder = dir > 0      ? [charOrder[2], charOrder[0], charOrder[1]]
      : [charOrder[1], charOrder[2], charOrder[0]];
    applyPositions();
  }
  window.selectCharacter = function(charName) {
    const currentCenter = charOrder[1];
    if (charName === currentCenter) {
      window.location.href = '/the-problem-children#' + charName;
      return;
    }
    const idx = charOrder.indexOf(charName);
    if (idx === 0) rotate(-1);
    if (idx === 2) rotate(1);
  };
  applyPositions();
  // Arrow button clicks
  document.querySelectorAll('.char-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      rotate(btn.classList.contains('char-arrow-right') ? 1 : -1);
    });
  });
  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') rotate(-1);
    if (e.key === 'ArrowRight') rotate(1);
  });
})();