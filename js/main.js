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
// ملاحظة: العدّاد يحفظ موعد انتهاء العرض في localStorage بدل ما يبدأ من صفر
// كل مرة يفتح فيها الزائر الصفحة. عدّاد "استعجال" يتصفّر كل ريفرش يخلي
// الزائر يفقد الثقة بالموقع بمجرد ما يلاحظها. هنا العرض ينتهي فعلياً
// بعد 24 ساعة من أول زيارة، وما يتجدد إلا بعد انتهائه فعلاً.
function initCountdowns() {
  const DURATION_MS = 24 * 60 * 60 * 1000; // 24 ساعة
  document.querySelectorAll('[id$="-timer"]').forEach(el => {
    const id = el.id;
    const storageKey = 'ide_offer_deadline_' + id;
    let deadline;
    try {
      deadline = parseInt(localStorage.getItem(storageKey), 10);
      if (!deadline || isNaN(deadline) || deadline < Date.now()) {
        deadline = Date.now() + DURATION_MS;
        localStorage.setItem(storageKey, String(deadline));
      }
    } catch (e) {
      deadline = Date.now() + DURATION_MS; // متصفح يمنع localStorage
    }
    el.innerHTML = '<span class="countdown-label">ينتهي العرض خلال</span><div class="countdown-box" dir="ltr">' +
      '<div class="countdown-unit"><span class="countdown-num" id="' + id + '-h">00</span><span>ساعة</span></div>' +
      '<span class="countdown-sep">:</span><div class="countdown-unit"><span class="countdown-num" id="' + id + '-m">00</span><span>دقيقة</span></div>' +
      '<span class="countdown-sep">:</span><div class="countdown-unit"><span class="countdown-num" id="' + id + '-s">00</span><span>ثانية</span></div></div>';
    const hEl = document.getElementById(id + '-h');
    const mEl = document.getElementById(id + '-m');
    const sEl = document.getElementById(id + '-s');
    function tick() {
      const timeLeft = Math.floor((deadline - Date.now()) / 1000);
      if (timeLeft <= 0) { el.innerHTML = '<p style="color:#8B0000;font-size:1.125rem;font-weight:700;">انتهى العرض</p>'; return; }
      const hours = Math.floor(timeLeft / 3600);
      const mins = Math.floor((timeLeft % 3600) / 60);
      const secs = timeLeft % 60;
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
      setTimeout(tick, 1000);
    }
    tick();
  });
}

// Gallery / Testimonials
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

  function card(src) {
    return '<div style="width:100%;aspect-ratio:1/1;border-radius:0.75rem;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">' +
      '<img src="' + src + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;"></div>';
  }

  function showSlide(idx) {
    slideIdx = ((idx % slides.length) + slides.length) % slides.length;
    container.innerHTML = slides[slideIdx].map(card).join('');
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

// Purchase-intent tracking
// المشكلة: الموقع ما فيه أي طريقة لقياس كم زائر ضغط "شراء" أو وصل لصفحة
// الدفع الخارجية (alfan.link)، لأنها منصة منفصلة غير مربوطة بأناليتكس.
// هذه الدالة تحل المشكلة جزئياً بطريقتين:
// 1) تضيف UTM parameters لكل رابط شراء (تساعد لو راجعت لوحة تحكم alfan.link لاحقاً)
// 2) ترسل حدث GA4 "begin_checkout" لحظة الضغط، حتى تقدر تشوف في تقارير
//    أناليتكس (Events) كم شخص فعلاً نوى الشراء، ومن أي كتاب بالضبط.
function initBuyTracking() {
  document.querySelectorAll('a[href*="alfan.link"]').forEach(function (a) {
    try {
      var url = new URL(a.href);
      if (!url.searchParams.has('utm_source')) {
        url.searchParams.set('utm_source', 'website');
        url.searchParams.set('utm_medium', 'cta_button');
        url.searchParams.set('utm_campaign', (document.title || 'website').slice(0, 60));
      }
      a.href = url.toString();
    } catch (e) { /* رابط غير صالح، تجاهل */ }

    a.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'begin_checkout', {
          link_text: a.textContent.trim(),
          link_url: a.href,
          page_location: window.location.href
        });
      }
    });
  });
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
  initBuyTracking();
});