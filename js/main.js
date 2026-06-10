// Loading Screen
function initLoading() {
  const ls = document.getElementById('loading-screen');
  if (ls) ls.classList.add('hide');
}

// Scroll Animations
function initScrollAnim() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-40px' });
  document.querySelectorAll('.scroll-hidden').forEach(el => observer.observe(el));
}

// FAQ Toggle
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
  item.classList.toggle('active', !isOpen);
}

// Counters
function initCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const text = el.textContent;
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    let count = 0;
    const step = Math.ceil(target / 80);
    const suffix = text.includes('%') ? '%' : text.includes('+') ? '+' : '';
    const timer = setInterval(() => {
      count += step;
      if (count >= target) { el.textContent = target.toLocaleString() + suffix; clearInterval(timer); }
      else { el.textContent = count.toLocaleString() + suffix; }
    }, 20);
  });
}

// Countdown
function initCountdowns() {
  document.querySelectorAll('[id$="-timer"]').forEach(el => {
    const id = el.id;
    let timeLeft = 45 * 60;
    el.innerHTML = '<span class="countdown-label">ينتهي العرض خلال</span><div class="countdown-box" dir="ltr"><div class="countdown-unit"><span class="countdown-num" id="' + id + '-m">00</span><span>دقيقة</span></div><span class="countdown-sep">:</span><div class="countdown-unit"><span class="countdown-num" id="' + id + '-s">00</span><span>ثانية</span></div></div>';
    const mEl = document.getElementById(id + '-m');
    const sEl = document.getElementById(id + '-s');
    function tick() {
      if (timeLeft <= 0) { el.innerHTML = '<p style="color:#8B0000;font-size:1.125rem;font-weight:700;">انتهى العرض</p>'; return; }
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
      timeLeft--;
      setTimeout(tick, 1000);
    }
    tick();
  });
}

// Gallery
function initGallery() {
  const slides = [
    ["images/customers/ahmed.jpg","images/customers/sara.jpg"],
    ["images/customers/mohamed.jpg","images/customers/noura.jpg"],
    ["images/customers/khaled.jpg","images/customers/lina.jpg"],
    ["images/customers/yousef.jpg","images/customers/mariam.jpg"],
    ["images/customers/ali.jpg","images/customers/nada.jpg"],
    ["images/customers/fahad.jpg","images/customers/rana.jpg"]
  ];
  let slideIdx = 0;
  const container = document.getElementById('gallery-slide');
  const dotsContainer = document.getElementById('gallery-dots');
  if (!container || !dotsContainer) return;

  function showSlide(idx) {
    slideIdx = ((idx % slides.length) + slides.length) % slides.length;
    container.innerHTML = slides[slideIdx].map(src => '<div style="width:calc(50% - 6px);max-width:160px;aspect-ratio:1;border-radius:0.75rem;overflow:hidden;border:2px solid rgba(212,175,55,0.15);"><img src="' + src + '" alt="صورة عميل" style="width:100%;height:100%;object-fit:cover;display:block;"></div>').join('');
    dotsContainer.innerHTML = slides.map((_, i) => '<button class="gallery-dot ' + (i === slideIdx ? 'active' : 'inactive') + '" data-slide="' + i + '"></button>').join('');
    dotsContainer.querySelectorAll('.gallery-dot').forEach(dot => dot.addEventListener('click', () => showSlide(parseInt(dot.dataset.slide))));
  }

  var nextBtn = document.getElementById('gallery-next');
  var prevBtn = document.getElementById('gallery-prev');
  if (nextBtn) nextBtn.addEventListener('click', function() { showSlide(slideIdx + 1); });
  if (prevBtn) prevBtn.addEventListener('click', function() { showSlide(slideIdx - 1); });
  showSlide(0);
}

// Hero Particles
function initParticles() {
  var container = document.getElementById('hero-particles');
  if (!container) return;
  for (var i = 0; i < 8; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    p.style.background = i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#8B0000' : '#ffffff';
    p.style.left = ((i * 37 + 13) % 100) + '%';
    p.style.top = ((i * 53 + 7) % 100) + '%';
    p.style.animation = 'float-particle ' + (4 + (i % 3) * 2) + 's ' + (i * 0.3) + 's linear infinite';
    container.appendChild(p);
  }
}

// Smoke Canvas
function initSmoke() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  var canvas = document.getElementById('smoke-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var w = canvas.width = window.innerWidth;
  var h = canvas.height = window.innerHeight;
  var paused = false;
  var particles = [];
  for (var i = 0; i < 6; i++) {
    particles.push({ x: Math.random() * w, y: Math.random() * h, r: 80 + Math.random() * 120, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.1, a: 0.03 + Math.random() * 0.02 });
  }
  function draw() {
    if (paused) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, w, h);
    for (var j = 0; j < particles.length; j++) {
      var p = particles[j];
      p.x += p.vx; p.y += p.vy;
      if (p.x < -p.r) p.x = w + p.r;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
      if (p.y > h + p.r) p.y = -p.r;
      ctx.globalAlpha = p.a * 0.5;
      ctx.fillStyle = '#8B0000';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', function() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
  document.addEventListener('visibilitychange', function() { paused = document.hidden; });
}

// Cursor Effects
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  var cursor = document.getElementById('cursor-main');
  var trail = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;
  cursor.style.display = 'block';
  trail.style.display = 'block';
  var mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; cursor.style.transform = 'translate(' + (mx - 12) + 'px, ' + (my - 12) + 'px)'; });
  function anim() {
    cx += (mx - cx - 12) * 0.08;
    cy += (my - cy - 12) * 0.08;
    trail.style.transform = 'translate(' + cx + 'px, ' + cy + 'px)';
    requestAnimationFrame(anim);
  }
  anim();
}

// Init
document.addEventListener('DOMContentLoaded', function() {
  initLoading();
  initParticles();
  initScrollAnim();
  initCounters();
  initCountdowns();
  initGallery();
  initSmoke();
  initCursor();
});