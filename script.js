// Pixel rain background
(function () {
  const canvas = document.getElementById('pixel-rain');
  const ctx = canvas.getContext('2d');
  let w, h;
  const pixels = [];
  const PIXEL_COUNT = 35;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createPixel() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.2,
    };
  }

  function init() {
    resize();
    for (let i = 0; i < PIXEL_COUNT; i++) pixels.push(createPixel());
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pixels) {
      ctx.fillStyle = `rgba(138, 200, 255, ${p.opacity})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      p.y += p.speed;
      p.x += p.drift;
      if (p.y > h + 4) {
        p.y = -4;
        p.x = Math.random() * w;
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
document.querySelector('.nav-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Publication tabs
document.querySelectorAll('.pub-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pub-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pub-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// Scroll reveal
const reveals = document.querySelectorAll(
  '.about-content, .pub-year-group, .course-card, .cv-block'
);
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);
reveals.forEach(el => observer.observe(el));
