/* ══════════════════════════════════════════
   INTRO ANIMATION
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const intro = document.getElementById('intro');
    intro.classList.add('hide');
    setTimeout(() => intro.style.display = 'none', 900);
  }, 2000);
});

/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .cast-card, .gallery-item, .btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1.8)';
    ring.style.borderColor = 'var(--neon-blue)';
    ring.style.boxShadow = '0 0 15px var(--neon-blue)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.borderColor = 'var(--neon-red)';
    ring.style.boxShadow = '0 0 8px var(--neon-red)';
  });
});

/* ══════════════════════════════════════════
   WEB TRAIL CANVAS
══════════════════════════════════════════ */
const webCanvas = document.getElementById('web-canvas');
const wCtx = webCanvas.getContext('2d');
let points = [], mouseX = 0, mouseY = 0;
const MAX_POINTS = 18, MAX_CONNECTIONS = 6, MAX_DIST = 130;

function resizeWeb() { webCanvas.width = window.innerWidth; webCanvas.height = window.innerHeight; }
resizeWeb(); window.addEventListener('resize', resizeWeb);

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  points.push({ x: mouseX, y: mouseY, life: 1 });
  if (points.length > MAX_POINTS) points.shift();
});

(function drawWeb() {
  wCtx.clearRect(0, 0, webCanvas.width, webCanvas.height);
  points.forEach(p => { p.life -= 0.015; });
  points = points.filter(p => p.life > 0);

  for (let i = 0; i < points.length; i++) {
    let conns = 0;
    for (let j = i + 1; j < points.length && conns < MAX_CONNECTIONS; j++) {
      const dx = points[j].x - points[i].x;
      const dy = points[j].y - points[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = Math.min(points[i].life, points[j].life) * (1 - dist / MAX_DIST) * 0.6;
        wCtx.beginPath();
        wCtx.moveTo(points[i].x, points[i].y);
        wCtx.lineTo(points[j].x, points[j].y);
        wCtx.strokeStyle = `rgba(232,25,44,${alpha})`;
        wCtx.lineWidth = 0.8;
        wCtx.stroke();
        conns++;
      }
    }
    // Node dot
    const r = points[i].life * 2;
    wCtx.beginPath();
    wCtx.arc(points[i].x, points[i].y, r, 0, Math.PI * 2);
    wCtx.fillStyle = `rgba(232,25,44,${points[i].life * 0.5})`;
    wCtx.fill();
  }
  requestAnimationFrame(drawWeb);
})();

/* ══════════════════════════════════════════
   CITY SKYLINE CANVAS
══════════════════════════════════════════ */
const cityCanvas = document.getElementById('city-canvas');
const cCtx = cityCanvas.getContext('2d');
const cityBgImage = new Image();
cityBgImage.src = 'marvels-spider-man-3840x2160-11990.jpeg';

function drawCityBackground() {
  const W = cityCanvas.width;
  const H = cityCanvas.height;
  cCtx.clearRect(0, 0, W, H);

  // Fallback if image is still loading or fails.
  const sky = cCtx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#020811');
  sky.addColorStop(0.6, '#050d1a');
  sky.addColorStop(1, '#08111f');
  cCtx.fillStyle = sky;
  cCtx.fillRect(0, 0, W, H);

  if (cityBgImage.complete && cityBgImage.naturalWidth > 0) {
    const imgW = cityBgImage.naturalWidth;
    const imgH = cityBgImage.naturalHeight;
    const scale = Math.max(W / imgW, H / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const dx = (W - drawW) / 2;
    const dy = (H - drawH) / 2;
    cCtx.drawImage(cityBgImage, dx, dy, drawW, drawH);
  }

  // Keep the same cinematic tint used in the design.
  const tint = cCtx.createLinearGradient(0, 0, 0, H);
  tint.addColorStop(0, 'rgba(5,13,26,0.35)');
  tint.addColorStop(0.65, 'rgba(5,13,26,0.2)');
  tint.addColorStop(1, 'rgba(232,25,44,0.12)');
  cCtx.fillStyle = tint;
  cCtx.fillRect(0, 0, W, H);
}

function resizeCity() {
  cityCanvas.width = cityCanvas.offsetWidth;
  cityCanvas.height = cityCanvas.offsetHeight;
  drawCityBackground();
}
resizeCity();
window.addEventListener('resize', resizeCity);
cityBgImage.onload = drawCityBackground;
cityBgImage.onerror = drawCityBackground;

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), 80);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

/* ══════════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
const floatCta = document.getElementById('float-cta');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  floatCta.classList.toggle('visible', window.scrollY > 400);
});

/* ══════════════════════════════════════════
   CINEMATIC SCROLL UX
══════════════════════════════════════════ */
const sections = Array.from(document.querySelectorAll('#hero, #about, #cast, #trailer, #gallery, #countdown, footer'));
const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));

const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.innerHTML = '<div class="scroll-progress-bar" id="scroll-progress-bar"></div>';
document.body.appendChild(progress);
const progressBar = document.getElementById('scroll-progress-bar');

function updateScrollProgress() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const pct = Math.min(100, (window.scrollY / maxScroll) * 100);
  progressBar.style.height = `${pct}%`;
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const activeId = entry.target.id;

    navAnchors.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${activeId}`);
    });

    if (entry.target.tagName.toLowerCase() === 'section') {
      entry.target.classList.add('section-focus');
      setTimeout(() => entry.target.classList.remove('section-focus'), 850);
    }
  });
}, { threshold: 0.55 });

sections.forEach(section => {
  if (section.tagName.toLowerCase() === 'section') sectionObserver.observe(section);
});

window.addEventListener('scroll', () => {
  updateScrollProgress();
}, { passive: true });

window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

/* ══════════════════════════════════════════
   CAST CARDS
══════════════════════════════════════════ */
const castData = [
  { emoji:'🕷️', name:'Tom Holland',    role:'Peter Parker',    char:'Spider-Man',     img:'cast/tom.webp', desc:'Struggling to rebuild after the world forgot his name, Peter faces his greatest challenge: being ordinary.' },
  { emoji:'🦹‍♀️', name:'Zendaya',       role:'MJ Watson',       char:'Mary Jane',      img:'cast/zendaya.webp', desc:'Smart, sharp, and endlessly perceptive, MJ may be the one person who remembers the truth.' },
  { emoji:'🎒', name:'Jacob Batalon',  role:'Ned Leeds',       char:'Ned Leeds',      img:'cast/jacob.jpg', desc:'Peter\'s loyal friend whose humor and heart remain a steady anchor in uncertain times.' },
  { emoji:'🧠', name:'Mark Ruffalo',   role:'Bruce Banner',    char:'The Hulk',       img:'cast/mark.jpg', desc:'A brilliant mind carrying heavy burdens, offering guidance when Peter needs perspective most.' },
  { emoji:'🔥', name:'Sadie Sink',     role:'Mysterious Ally', char:'Jean Grey',      img:'cast/sadie sink.jpg', desc:'A powerful newcomer with secrets of her own, stepping into a world where trust is fragile.' },
];

const castGrid = document.getElementById('cast-grid');
castData.forEach((c, i) => {
  const card = document.createElement('div');
  card.className = 'cast-card reveal';
  card.style.transitionDelay = `${i * 60}ms`;
  card.innerHTML = `
    <div class="cast-inner">
      <div class="cast-front">
        <div class="cast-avatar">${c.img ? `<img src="${c.img}" alt="${c.name}" loading="lazy" decoding="async">` : c.emoji}</div>
        <div class="cast-info">
          <div class="cast-name">${c.name}</div>
          <div class="cast-role">${c.role}</div>
        </div>
        <span class="flip-hint">click to flip</span>
      </div>
      <div class="cast-back">
        <div class="cast-back-name">${c.char}</div>
        <div class="cast-back-char">${c.role}</div>
        <div class="cast-back-desc">${c.desc}</div>
      </div>
    </div>`;

  // Flip on click
  card.addEventListener('click', () => card.classList.toggle('flipped'));

  // 3D tilt on mouse move
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx2 = ((e.clientY - cy) / rect.height) * -18;
    const ry2 = ((e.clientX - cx) / rect.width) * 18;
    const inner = card.querySelector('.cast-inner');
    inner.style.transform = card.classList.contains('flipped')
      ? `rotateY(180deg) rotateX(${rx2 * 0.5}deg)`
      : `rotateX(${rx2}deg) rotateY(${ry2}deg)`;
    inner.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    const inner = card.querySelector('.cast-inner');
    inner.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
    inner.style.transform = card.classList.contains('flipped') ? 'rotateY(180deg)' : '';
  });

  castGrid.appendChild(card);
  observer.observe(card);
});

/* ══════════════════════════════════════════
   GALLERY
══════════════════════════════════════════ */
const galleryData = [
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'Skyline Swing', pos:'50% 35%', filter:'saturate(1.15) contrast(1.05)' },
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'Suit Detail', pos:'68% 42%', filter:'saturate(1.2) contrast(1.08)' },
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'Wall-Crawl Focus', pos:'35% 52%', filter:'saturate(1.12) contrast(1.04)' },
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'Rooftop Watch', pos:'80% 40%', filter:'saturate(1.05) contrast(1.12)' },
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'Midnight Patrol', pos:'18% 46%', filter:'hue-rotate(-8deg) saturate(1.1) contrast(1.06)' },
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'Neon Reflections', pos:'60% 62%', filter:'saturate(1.2) contrast(1.03) brightness(0.98)' },
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'City Edge', pos:'8% 32%', filter:'saturate(1.08) contrast(1.09)' },
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'Hero Landing', pos:'52% 74%', filter:'saturate(1.18) contrast(1.05)' },
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'Chasing Shadows', pos:'74% 52%', filter:'saturate(1.06) contrast(1.1)' },
  { src:'marvels-spider-man-3840x2160-11990.jpeg', cap:'Night Sentinel', pos:'30% 30%', filter:'saturate(1.14) contrast(1.07)' },
];

const galleryGrid = document.getElementById('gallery-grid');
galleryData.forEach((g, i) => {
  const item = document.createElement('div');
  item.className = 'gallery-item reveal';
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  item.setAttribute('aria-label', `Open photo: ${g.cap}`);
  item.innerHTML = `
    <span class="gallery-badge">Shot ${String(i + 1).padStart(2, '0')}</span>
    <div class="gallery-img" style="--img-pos:${g.pos};--img-filter:${g.filter};">
      <img src="${g.src}" alt="Spider-Man - ${g.cap}" loading="lazy" decoding="async">
    </div>
    <div class="gallery-overlay"><span class="gallery-caption">${g.cap}</span></div>`;
  item.addEventListener('click', () => openGallery(i));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGallery(i);
    }
  });
  galleryGrid.appendChild(item);
  observer.observe(item);
});

const galleryLightbox = document.createElement('div');
galleryLightbox.className = 'gallery-lightbox';
galleryLightbox.id = 'gallery-lightbox';
galleryLightbox.innerHTML = `
  <div class="gallery-lightbox-panel">
    <button class="gallery-close" id="gallery-close">✕ Close</button>
    <button class="gallery-nav gallery-prev" id="gallery-prev" aria-label="Previous photo">◀</button>
    <img class="gallery-lightbox-image" id="gallery-lightbox-image" src="" alt="Spider-Man gallery image">
    <button class="gallery-nav gallery-next" id="gallery-next" aria-label="Next photo">▶</button>
    <p class="gallery-lightbox-caption" id="gallery-lightbox-caption"></p>
  </div>`;
document.body.appendChild(galleryLightbox);

const galleryLightboxImage = document.getElementById('gallery-lightbox-image');
const galleryLightboxCaption = document.getElementById('gallery-lightbox-caption');
let activeGalleryIndex = 0;

function renderGalleryLightbox() {
  const item = galleryData[activeGalleryIndex];
  galleryLightboxImage.src = item.src;
  galleryLightboxImage.alt = `Spider-Man photo - ${item.cap}`;
  galleryLightboxImage.style.objectPosition = item.pos;
  galleryLightboxImage.style.filter = item.filter;
  galleryLightboxCaption.textContent = item.cap;
}

function openGallery(index) {
  activeGalleryIndex = index;
  renderGalleryLightbox();
  galleryLightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  galleryLightbox.classList.remove('active');
  if (!document.getElementById('trailer-dim').classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

function shiftGallery(step) {
  activeGalleryIndex = (activeGalleryIndex + step + galleryData.length) % galleryData.length;
  renderGalleryLightbox();
}

document.getElementById('gallery-close').addEventListener('click', closeGallery);
document.getElementById('gallery-prev').addEventListener('click', () => shiftGallery(-1));
document.getElementById('gallery-next').addEventListener('click', () => shiftGallery(1));
galleryLightbox.addEventListener('click', e => {
  if (e.target === galleryLightbox) closeGallery();
});

/* ══════════════════════════════════════════
   COUNTDOWN
══════════════════════════════════════════ */
function getNextReleaseDate() {
  const now = new Date();
  const year = now.getFullYear();
  let next = new Date(year, 6, 31, 0, 0, 0, 0); // July is month index 6
  if (now >= next) {
    next = new Date(year + 1, 6, 31, 0, 0, 0, 0);
  }
  return next;
}

const releaseDate = getNextReleaseDate().getTime();
const cdDays = document.getElementById('cd-days');
const cdHrs  = document.getElementById('cd-hrs');
const cdMin  = document.getElementById('cd-min');
const cdSec  = document.getElementById('cd-sec');

const releaseNoteSpan = document.querySelector('.release-note span');
if (releaseNoteSpan) {
  const formatted = new Date(releaseDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  releaseNoteSpan.textContent = formatted;
}

function pad(n) { return String(n).padStart(2, '0'); }
function tick(el, val) {
  if (el.textContent !== val) {
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
    el.textContent = val;
  }
}

function updateCountdown() {
  const now = Date.now();
  const diff = Math.max(0, releaseDate - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  tick(cdDays, pad(d));
  tick(cdHrs, pad(h));
  tick(cdMin, pad(m));
  tick(cdSec, pad(s));
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ══════════════════════════════════════════
   TRAILER MODAL
══════════════════════════════════════════ */
function openTrailer(e) {
  e.preventDefault();
  const dim = document.getElementById('trailer-dim');
  const iframe = document.getElementById('trailer-iframe');
  iframe.src = 'https://www.youtube.com/embed/aBlsrtxuwss?autoplay=1&rel=0&modestbranding=1&playsinline=1';
  dim.classList.add('active');
  document.body.style.overflow = 'hidden';
}

document.getElementById('close-trailer').addEventListener('click', () => {
  const dim = document.getElementById('trailer-dim');
  const iframe = document.getElementById('trailer-iframe');
  dim.classList.remove('active');
  iframe.src = '';
  document.body.style.overflow = '';
});

document.getElementById('trailer-dim').addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    document.getElementById('close-trailer').click();
  }
});

document.getElementById('watch-trailer-btn').addEventListener('click', openTrailer);
document.getElementById('trailer-frame').addEventListener('click', openTrailer);

/* ══════════════════════════════════════════
   BTN RIPPLE EFFECT
══════════════════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    r.style.width = r.style.height = size + 'px';
    r.style.left = (e.clientX - rect.left - size/2) + 'px';
    r.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});

/* ══════════════════════════════════════════
   FLOAT BTN — WEB SHOOT
══════════════════════════════════════════ */
document.getElementById('float-btn').addEventListener('click', e => {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const web = document.createElement('div');
      web.className = 'web-shoot';
      const angle = -60 + i * 25;
      web.style.left = e.clientX + 'px';
      web.style.top = e.clientY + 'px';
      web.style.transform = `rotate(${angle}deg)`;
      document.body.appendChild(web);
      setTimeout(() => web.remove(), 600);
    }, i * 40);
  }
  setTimeout(() => {
    document.getElementById('countdown').scrollIntoView({ behavior:'smooth' });
  }, 300);
});

/* ══════════════════════════════════════════
   PARALLAX
══════════════════════════════════════════ */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      const heroBg = document.getElementById('hero-bg');
      if (heroBg) heroBg.style.transform = `translateY(${sy * 0.4}px)`;
      ticking = false;
    });
    ticking = true;
  }
});

/* ══════════════════════════════════════════
   WORD-BY-WORD REVEAL (About text)
══════════════════════════════════════════ */
const aboutText = document.querySelector('.about-text');
if (aboutText) {
  const aboutObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const words = aboutText.querySelectorAll('p');
      words.forEach((p, pi) => {
        const html = p.innerHTML;
        const parts = html.split(/(<[^>]+>|[^<\s]+|\s+)/g).filter(Boolean);
        let delay = pi * 200;
        let rebuilt = '';
        parts.forEach(part => {
          if (part.startsWith('<')) {
            rebuilt += part;
          } else if (/^\s+$/.test(part)) {
            rebuilt += part;
          } else {
            rebuilt += `<span class="word" style="transition-delay:${delay}ms">${part}</span>`;
            delay += 30;
          }
        });
        p.innerHTML = rebuilt;
        setTimeout(() => {
          p.querySelectorAll('.word').forEach(w => w.classList.add('in'));
        }, 200 + pi * 150);
      });
      aboutObs.disconnect();
    }
  }, { threshold: 0.3 });
  aboutObs.observe(aboutText);
}

/* ══════════════════════════════════════════
   KEYBOARD NAVIGATION
══════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const dim = document.getElementById('trailer-dim');
    if (galleryLightbox.classList.contains('active')) {
      closeGallery();
      return;
    }
    if (dim.classList.contains('active')) {
      document.getElementById('close-trailer').click();
    }
  }
  if (galleryLightbox.classList.contains('active')) {
    if (e.key === 'ArrowLeft') shiftGallery(-1);
    if (e.key === 'ArrowRight') shiftGallery(1);
  }
});

