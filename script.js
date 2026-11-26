/* ============================================================
   KOMSOS PAROKI KARAWACI - SANTO AGUSTINUS
   Script lengkap: bintang, salju, tema, navigasi, kembang api
   ============================================================ */

// ============ 1. BINTANG LATAR ============
const starsContainer = document.getElementById('stars');
const STAR_COUNT = 60;

for (let i = 0; i < STAR_COUNT; i++) {
  const star = document.createElement('div');
  star.classList.add('star');

  const size = Math.random() * 2 + 1;
  star.style.width = size + 'px';
  star.style.height = size + 'px';
  star.style.left = Math.random() * 100 + 'vw';
  star.style.top = Math.random() * 100 + 'vh';
  star.style.animationDelay = Math.random() * 3 + 's';
  star.style.animationDuration = (Math.random() * 2 + 2) + 's';

  starsContainer.appendChild(star);
}

// ============ 2. SALJU TURUN ============
const snowContainer = document.getElementById('snow');
const SYMBOLS = ['❄', '❅', '❆', '•', '·'];
const SNOW_COUNT = 40;

for (let i = 0; i < SNOW_COUNT; i++) {
  const flake = document.createElement('div');
  flake.classList.add('snowflake');
  flake.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  flake.style.left = Math.random() * 100 + 'vw';
  flake.style.fontSize = (Math.random() * 10 + 6) + 'px';
  flake.style.animationDuration = (Math.random() * 8 + 8) + 's';
  flake.style.animationDelay = Math.random() * 10 + 's';
  flake.style.opacity = Math.random() * 0.5 + 0.3;

  snowContainer.appendChild(flake);
}

// ============ 3. GANTI TEMA ============
const themeButtons = document.querySelectorAll('.theme-btn');

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    document.body.removeAttribute('data-theme');
    if (theme !== 'midnight') {
      document.body.setAttribute('data-theme', theme);
    }
    themeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ============ 4. NAVIGASI ANTAR HALAMAN ============
const pageChristmas = document.getElementById('pageChristmas');
const pageNewYear = document.getElementById('pageNewYear');
const toNewYearBtn = document.getElementById('toNewYear');
const toChristmasBtn = document.getElementById('toChristmas');

toNewYearBtn.addEventListener('click', () => {
  pageChristmas.classList.remove('active');
  pageNewYear.classList.add('active');
});

toChristmasBtn.addEventListener('click', () => {
  pageNewYear.classList.remove('active');
  pageChristmas.classList.add('active');
});

// ============ 5. KEMBANG API (CANVAS) ============
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;

function resizeCanvas() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const fireworkColors = [
  '#5eead4', '#f5c6a5', '#fbcfe8', '#a78bfa', '#f9a8d4',
  '#67e8f9', '#fde68a', '#fda4af', '#c4b5fd', '#86efac',
  '#fef08a', '#fca5a5'
];

// Bentuk partikel lucu
const shapeTypes = ['circle', 'star', 'heart', 'sparkle'];

// Partikel
class Particle {
  constructor(x, y, color, shape) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.shape = shape;

    // kecepatan acak ke segala arah
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.gravity = 0.08;
    this.friction = 0.97;
    this.alpha = 1;
    this.decay = Math.random() * 0.012 + 0.008;
    this.size = Math.random() * 3 + 2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    this.trail = [];
  }

  update() {
    // Simpan jejak
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 4) this.trail.shift();

    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // glow
    ctx.shadowBlur = 14;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'star') {
      drawStar(ctx, 0, 0, 5, this.size * 2, this.size * 0.9);
    } else if (this.shape === 'heart') {
      drawHeart(ctx, 0, 0, this.size * 1.6);
    } else {
      // sparkle
      ctx.fillRect(-this.size / 2, -this.size * 2, this.size, this.size * 4);
      ctx.fillRect(-this.size * 2, -this.size / 2, this.size * 4, this.size);
    }

    ctx.restore();
  }
}

// Fungsi gambar bintang
function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
}

// Fungsi gambar hati
function drawHeart(ctx, cx, cy, size) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(cx, cy + topCurveHeight);
  // kiri atas
  ctx.bezierCurveTo(
    cx - size / 2, cy - size / 2,
    cx - size, cy + size / 3,
    cx, cy + size
  );
  // kanan atas
  ctx.bezierCurveTo(
    cx + size, cy + size / 3,
    cx + size / 2, cy - size / 2,
    cx, cy + topCurveHeight
  );
  ctx.closePath();
  ctx.fill();
}

// Ledakan kembang api di titik (x, y)
function explode(x, y, count = 80, palette = null) {
  const colors = palette || fireworkColors;

  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    particles.push(new Particle(x, y, color, shape));
  }

  // Bunyi "pop" (opsional, aman untuk browser modern)
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch (e) {
    // abaikan jika browser blokir audio
  }
}

// Animasi loop
function animate() {
  ctx.clearRect(0, 0, W, H);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}
animate();

// Ledakan bertahap di beberapa titik
function fireworksShow(centerX, centerY, duration = 2500) {
  const startTime = Date.now();

  function launch() {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration) return;

    // ledakan di sekitar titik tengah dengan sebaran acak
    const offsetX = (Math.random() - 0.5) * Math.min(W * 0.6, 500);
    const offsetY = (Math.random() - 0.5) * Math.min(H * 0.4, 300);

    const x = Math.max(50, Math.min(W - 50, centerX + offsetX));
    const y = Math.max(80, Math.min(H - 50, centerY + offsetY));

    explode(x, y, 70);

    // jadwalkan ledakan berikutnya
    setTimeout(launch, Math.random() * 400 + 200);
  }

  // 3 ledakan awal bersamaan
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const x = W / 2 + (Math.random() - 0.5) * W * 0.5;
      const y = H / 2 + (Math.random() - 0.5) * H * 0.4;
      explode(
        Math.max(50, Math.min(W - 50, x)),
        Math.max(80, Math.min(H - 50, y)),
        90
      );
    }, i * 120);
  }

  // lanjutkan dengan ledakan bertahap
  setTimeout(launch, 600);
}

// ============ 6. TOMBOL UCAPAN: KLIK = KEMBANG API ============
const btnChristmas = document.getElementById('btnChristmas');
const btnNewYear = document.getElementById('btnNewYear');

function handleGreetClick(btn) {
  // efek tombol
  btn.classList.add('shake');
  setTimeout(() => btn.classList.remove('shake'), 500);

  // hitung posisi tengah tombol
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // tampilkan kembang api
  fireworksShow(cx, cy, 2800);
}

btnChristmas.addEventListener('click', () => handleGreetClick(btnChristmas));
btnNewYear.addEventListener('click', () => handleGreetClick(btnNewYear));

// Bonus: klik di mana saja (background) juga memicu kembang api kecil
document.body.addEventListener('click', (e) => {
  // jangan picu jika klik tombol (sudah ditangani) atau tema
  if (e.target.closest('.greet-btn') ||
      e.target.closest('.theme-btn') ||
      e.target.closest('.nav-btn')) return;

  explode(e.clientX, e.clientY, 30);
});