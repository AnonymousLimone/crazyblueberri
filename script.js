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

// Avatar face animation on load
(function () {
  const face = document.querySelector('.avatar-placeholder span');
  if (!face) return;
  const expressions = [':/',':|',':)', ':D', ':)'];
  let i = 0;
  face.textContent = expressions[0];
  const interval = setInterval(() => {
    i++;
    if (i >= expressions.length) {
      clearInterval(interval);
      return;
    }
    face.textContent = expressions[i];
  }, 400);
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

// Pixel Black Cat
(function () {
  const canvas = document.getElementById('cat-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const S = 3; // pixel scale

  const BLACK = '#1a1a2e';
  const DARK = '#2a2a3e';
  const EYE = '#8ec8ff';
  const EYE_BLINK = '#1a1a2e';
  const NOSE = '#e8a0bf';

  // Cat states: sit, lick, sleep, look
  let state = 'sit';
  let frame = 0;
  let stateTimer = 0;
  let tailWag = 0;
  let blinking = false;
  let blinkTimer = 0;

  function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * S, y * S, S, S);
  }

  function drawCatBase() {
    // Ears
    drawPixel(3, 0, BLACK); drawPixel(4, 0, BLACK);
    drawPixel(2, 1, BLACK); drawPixel(3, 1, DARK); drawPixel(4, 1, DARK);
    drawPixel(9, 0, BLACK); drawPixel(10, 0, BLACK);
    drawPixel(9, 1, DARK); drawPixel(10, 1, DARK); drawPixel(11, 1, BLACK);

    // Head
    for (let x = 3; x <= 10; x++) drawPixel(x, 2, BLACK);
    for (let x = 2; x <= 11; x++) drawPixel(x, 3, BLACK);
    for (let x = 2; x <= 11; x++) drawPixel(x, 4, BLACK);
    for (let x = 2; x <= 11; x++) drawPixel(x, 5, BLACK);
    for (let x = 3; x <= 10; x++) drawPixel(x, 6, BLACK);
  }

  function drawEyes(blink) {
    if (blink) {
      drawPixel(4, 4, EYE_BLINK); drawPixel(5, 4, EYE_BLINK);
      drawPixel(8, 4, EYE_BLINK); drawPixel(9, 4, EYE_BLINK);
    } else {
      drawPixel(4, 3, EYE); drawPixel(5, 3, EYE);
      drawPixel(4, 4, EYE); drawPixel(5, 4, EYE);
      drawPixel(8, 3, EYE); drawPixel(9, 3, EYE);
      drawPixel(8, 4, EYE); drawPixel(9, 4, EYE);
    }
    // Nose
    drawPixel(6, 5, NOSE); drawPixel(7, 5, NOSE);
  }

  function drawSitBody() {
    // Body
    for (let x = 3; x <= 10; x++) drawPixel(x, 7, BLACK);
    for (let x = 2; x <= 11; x++) drawPixel(x, 8, BLACK);
    for (let x = 2; x <= 11; x++) drawPixel(x, 9, BLACK);
    for (let x = 2; x <= 11; x++) drawPixel(x, 10, BLACK);
    for (let x = 2; x <= 11; x++) drawPixel(x, 11, BLACK);
    // Paws
    drawPixel(2, 12, DARK); drawPixel(3, 12, DARK); drawPixel(4, 12, DARK);
    drawPixel(9, 12, DARK); drawPixel(10, 12, DARK); drawPixel(11, 12, DARK);
  }

  function drawTail(wag) {
    const offY = Math.round(Math.sin(wag) * 1);
    drawPixel(12, 10 + offY, BLACK);
    drawPixel(13, 9 + offY, BLACK);
    drawPixel(14, 8 + offY, BLACK);
    drawPixel(15, 8 + offY, DARK);
  }

  function drawSleepEyes() {
    // Closed eyes as dashes
    drawPixel(4, 4, DARK); drawPixel(5, 4, DARK);
    drawPixel(8, 4, DARK); drawPixel(9, 4, DARK);
    drawPixel(6, 5, NOSE); drawPixel(7, 5, NOSE);
  }

  function drawZzz(f) {
    const offset = Math.floor(f / 8) % 3;
    const alpha = ((f % 8) / 8);
    ctx.fillStyle = `rgba(142, 200, 255, ${0.3 + alpha * 0.5})`;
    ctx.font = `${7 + offset}px 'Press Start 2P', monospace`;
    ctx.fillText('z', (13 - offset) * S, (2 + offset * 2) * S);
  }

  function drawLick(f) {
    const tongueOut = Math.floor(f / 6) % 2 === 0;
    drawPixel(6, 5, NOSE); drawPixel(7, 5, NOSE);
    if (tongueOut) {
      drawPixel(6, 6, NOSE); drawPixel(7, 6, NOSE);
    }
  }

  function drawLookEyes(f) {
    const lookRight = Math.floor(f / 12) % 2 === 0;
    if (lookRight) {
      drawPixel(5, 3, EYE); drawPixel(5, 4, EYE);
      drawPixel(9, 3, EYE); drawPixel(9, 4, EYE);
    } else {
      drawPixel(4, 3, EYE); drawPixel(4, 4, EYE);
      drawPixel(8, 3, EYE); drawPixel(8, 4, EYE);
    }
    drawPixel(6, 5, NOSE); drawPixel(7, 5, NOSE);
  }

  function render() {
    ctx.clearRect(0, 0, 48, 48);
    drawCatBase();
    drawSitBody();
    tailWag += 0.15;
    drawTail(tailWag);

    // Blink cycle
    blinkTimer++;
    if (blinkTimer > 60 && !blinking) {
      blinking = true;
      blinkTimer = 0;
    }
    if (blinking && blinkTimer > 4) {
      blinking = false;
      blinkTimer = 0;
    }

    if (state === 'sit') {
      drawEyes(blinking);
    } else if (state === 'sleep') {
      drawSleepEyes();
      drawZzz(frame);
    } else if (state === 'lick') {
      drawEyes(false);
      drawLick(frame);
    } else if (state === 'look') {
      drawLookEyes(frame);
    }

    frame++;
    stateTimer++;

    if (stateTimer > 180) {
      stateTimer = 0;
      const states = ['sit', 'sleep', 'lick', 'look', 'sit', 'sit'];
      state = states[Math.floor(Math.random() * states.length)];
    }

    requestAnimationFrame(render);
  }

  // Click on cat to wake it up
  canvas.parentElement.addEventListener('click', () => {
    state = 'look';
    stateTimer = 0;
  });

  render();
})();
