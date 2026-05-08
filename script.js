// Day/Night auto mode — darker palette after 8pm, before 7am
(function () {
  const hour = new Date().getHours();
  if (hour >= 20 || hour < 7) document.body.classList.add('night-mode');
})();

// Loader
(function () {
  const overlay = document.getElementById('loader-overlay');
  if (!overlay) return;
  setTimeout(() => {
    overlay.classList.add('done');
    setTimeout(() => overlay.remove(), 400);
  }, 800);
})();

// Profile photo — displayed as-is (original)

// Seasonal pixel rain
(function () {
  const canvas = document.getElementById('pixel-rain');
  const ctx = canvas.getContext('2d');
  let w, h;
  const particles = [];
  const COUNT = 35;

  const month = new Date().getMonth();
  const season = (month >= 2 && month <= 4) ? 'spring'
    : (month >= 5 && month <= 7) ? 'summer'
    : (month >= 8 && month <= 10) ? 'autumn' : 'winter';

  const palette = {
    spring: ['255,183,197', '255,200,210', '255,160,180', '255,220,230'],
    summer: ['138,200,255', '90,173,255', '186,221,255'],
    autumn: ['255,180,100', '230,140,80', '200,120,60', '255,200,120'],
    winter: ['220,230,255', '200,215,240', '240,245,255'],
  };

  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }

  function makeParticle() {
    const cols = palette[season];
    return {
      x: Math.random() * w, y: Math.random() * h,
      size: season === 'winter' ? Math.random() * 2 + 2
        : season === 'spring' ? Math.random() * 3 + 2
        : Math.random() * 3 + 1,
      speed: season === 'winter' ? Math.random() * 0.15 + 0.05
        : season === 'spring' ? Math.random() * 0.25 + 0.08
        : Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      drift: season === 'spring' ? (Math.random() - 0.5) * 0.5
        : season === 'autumn' ? (Math.random() - 0.3) * 0.4
        : (Math.random() - 0.5) * 0.2,
      col: cols[Math.floor(Math.random() * cols.length)],
      wobble: Math.random() * Math.PI * 2,
      wSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  resize();
  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      ctx.fillStyle = `rgba(${p.col},${p.opacity})`;
      p.wobble += p.wSpeed;
      const wx = Math.sin(p.wobble) * (season === 'autumn' ? 2 : season === 'spring' ? 1.5 : season === 'winter' ? 1 : 0);
      if (season === 'spring') {
        ctx.fillRect(Math.round(p.x + wx), Math.round(p.y), p.size, p.size * 0.7);
        ctx.fillRect(Math.round(p.x + wx + 1), Math.round(p.y + 1), p.size * 0.7, p.size);
      } else if (season === 'winter') {
        ctx.fillRect(Math.round(p.x + wx), Math.round(p.y), p.size, 1);
        ctx.fillRect(Math.round(p.x + wx + p.size / 2 - 0.5), Math.round(p.y - p.size / 2 + 0.5), 1, p.size);
      } else if (season === 'autumn') {
        ctx.fillRect(Math.round(p.x + wx), Math.round(p.y), p.size, p.size * 0.6);
      } else {
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      p.y += p.speed; p.x += p.drift;
      if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  draw();
})();

// Avatar icon cycle — click to switch: smiley → brain → speech bubble
(function () {
  const face = document.querySelector('.avatar-placeholder span');
  if (!face) return;
  const icons = [':)', '🧠', '💬'];
  let idx = 0;

  // entrance animation
  const expressions = [':/',':|',':)', ':D', ':)'];
  let ei = 0;
  face.textContent = expressions[0];
  const interval = setInterval(() => {
    ei++;
    if (ei >= expressions.length) { clearInterval(interval); return; }
    face.textContent = expressions[ei];
  }, 400);

  face.parentElement.addEventListener('click', () => {
    idx = (idx + 1) % icons.length;
    face.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    face.style.transform = 'scale(0.5)';
    face.style.opacity = '0';
    setTimeout(() => {
      face.textContent = icons[idx];
      face.style.fontSize = idx === 0 ? '' : '32px';
      face.style.transform = 'scale(1.2)';
      face.style.opacity = '1';
      setTimeout(() => { face.style.transform = 'scale(1)'; }, 150);
    }, 200);
  });
})();

// Name toggle — click to switch between English/Chinese
(function () {
  const h1 = document.querySelector('.glitch-text');
  if (!h1) return;
  h1.style.cursor = 'pointer';
  h1.addEventListener('click', () => {
    h1.classList.toggle('show-zh');
  });
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
  entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
  { threshold: 0.1 }
);
reveals.forEach(el => observer.observe(el));

// Konami code: ↑↑↓↓←←→→ — Game Boy palette + cat dance
(function () {
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  window.konamiActive = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === seq[idx]) {
      idx++;
      if (idx === seq.length) {
        idx = 0;
        if (!window.konamiActive) {
          window.konamiActive = true;
          document.body.classList.add('konami-mode');
          setTimeout(() => {
            document.body.classList.remove('konami-mode');
            window.konamiActive = false;
          }, 5000);
        }
      }
    } else {
      idx = e.key === seq[0] ? 1 : 0;
    }
  });
})();

// Logo blueberry bounce — click nav 🫐 to drop a bouncing blueberry
(function () {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  let dropping = false;

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    if (dropping) return;
    dropping = true;

    const rect = logo.getBoundingClientRect();
    const berry = document.createElement('span');
    berry.textContent = '🫐';
    berry.style.cssText = 'position:fixed;font-size:20px;z-index:9999;pointer-events:none;';
    berry.style.left = (rect.left + rect.width / 2 - 10) + 'px';
    berry.style.top = rect.bottom + 'px';
    document.body.appendChild(berry);

    let y = 0, vel = 0, bounces = 0;
    const floor = window.innerHeight - rect.bottom - 30;

    function tick() {
      vel += 0.5;
      y += vel;
      if (y >= floor) {
        y = floor; vel = -vel * 0.55; bounces++;
        if (bounces >= 4) {
          berry.style.transition = 'opacity 0.3s';
          berry.style.opacity = '0';
          setTimeout(() => { berry.remove(); dropping = false; }, 300);
          return;
        }
      }
      berry.style.top = (rect.bottom + y) + 'px';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Pixel Black Cat — interactive
(function () {
  const canvas = document.getElementById('cat-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const S = 3;
  const CW = 72, CH = 96;

  const isNight = document.body.classList.contains('night-mode');
  const BLACK = isNight ? '#4a4a60' : '#1a1a2e';
  const DARK = isNight ? '#5a5a72' : '#2a2a3e';
  const EYE = '#8ec8ff';
  const NOSE = '#e8a0bf';
  const HEART = '#f28ba8';
  const YARN = '#baddff';
  const YARN2 = '#8ec8ff';
  const BERRY_DARK = '#3b2d6b';
  const BERRY_MID = '#5a45a0';
  const BERRY_LIGHT = '#7b68c4';
  const BERRY_LEAF = '#6aab7a';
  const HAT_RED = '#e85a7a';
  const HAT_GOLD = '#ffd866';
  const HAT_TIP = '#ff8ca0';

  // states: idle, track, pet, eat, lonely, sleep, dance
  let state = document.body.classList.contains('night-mode') ? 'sleep' : 'idle';
  let frame = 0;
  let idleTimer = 0;
  let tailWag = 0;
  let blinking = false;
  let blinkTimer = 0;
  let lastInteraction = Date.now();
  const SLEEP_AFTER = 8000;

  let mouseNear = false;
  let mouseOver = false;
  let mouseOnHead = false;
  let mouseRelX = 0;
  let mouseRelY = 0;

  const catParticles = [];

  // blueberry drop
  let berryY = -10;
  let berryVel = 0;
  let berryActive = false;
  let eatTimer = 0;
  let berryCooldown = 0;

  // lonely
  let lonelyTimer = 0;

  // pet
  let petStrokes = 0;
  let lastPetX = -1;
  let petCooldown = 0;

  // dance (konami)
  let danceTimer = 0;

  const catEl = canvas.parentElement;
  const CAT_OY = 8;

  function updateMouseState(e) {
    const rect = catEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    mouseRelX = dx;
    mouseRelY = dy;

    const wasNear = mouseNear;
    mouseNear = dist < 120;
    mouseOver = dist < 50;
    mouseOnHead = mouseOver && (e.clientY - rect.top) < rect.height * 0.4;

    if (mouseNear) {
      lastInteraction = Date.now();
      if (state === 'sleep') { state = 'track'; idleTimer = 0; }
      if (state !== 'pet' && state !== 'eat' && state !== 'lonely' && state !== 'dance') {
        state = 'track';
        idleTimer = 0;
      }
    }

    if (!mouseNear && wasNear && state !== 'sleep' && state !== 'lonely' && state !== 'eat' && state !== 'dance') {
      state = 'lonely';
      lonelyTimer = 0;
    }
  }

  document.addEventListener('mousemove', updateMouseState);

  document.addEventListener('mousemove', (e) => {
    if (!mouseOnHead || petCooldown > 0) return;
    const rect = catEl.getBoundingClientRect();
    const px = e.clientX - rect.left;
    if (lastPetX >= 0 && Math.abs(px - lastPetX) > 6) {
      petStrokes++;
      if (petStrokes >= 3) {
        state = 'pet';
        idleTimer = 0;
        petStrokes = 0;
        petCooldown = 40;
        lastInteraction = Date.now();
      }
    }
    lastPetX = px;
  });

  // click = drop a blueberry
  catEl.addEventListener('click', () => {
    if (!berryActive && berryCooldown <= 0) {
      berryActive = true;
      berryY = 0;
      berryVel = 0;
      berryCooldown = 90;
      lastInteraction = Date.now();
    }
  });

  // particles
  function spawnHeart() {
    catParticles.push({
      type: 'heart',
      x: 4 + Math.random() * 6,
      y: CAT_OY - 3,
      life: 45, maxLife: 45,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.4,
    });
  }

  function spawnYarn() {
    catParticles.push({
      type: 'yarn',
      x: 5 + Math.random() * 4,
      y: CAT_OY - 3,
      life: 50, maxLife: 50,
      vx: 0, vy: -0.25,
      rot: Math.random() * 6.28,
    });
  }

  function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * S, y * S, S, S);
  }

  // cat parts
  function drawCatBase(oy) {
    drawPixel(3,0+oy,BLACK); drawPixel(4,0+oy,BLACK);
    drawPixel(2,1+oy,BLACK); drawPixel(3,1+oy,DARK); drawPixel(4,1+oy,DARK);
    drawPixel(9,0+oy,BLACK); drawPixel(10,0+oy,BLACK);
    drawPixel(9,1+oy,DARK); drawPixel(10,1+oy,DARK); drawPixel(11,1+oy,BLACK);
    for (let x=3;x<=10;x++) drawPixel(x,2+oy,BLACK);
    for (let x=2;x<=11;x++) drawPixel(x,3+oy,BLACK);
    for (let x=2;x<=11;x++) drawPixel(x,4+oy,BLACK);
    for (let x=2;x<=11;x++) drawPixel(x,5+oy,BLACK);
    for (let x=3;x<=10;x++) drawPixel(x,6+oy,BLACK);
  }

  function drawBody(oy) {
    for (let x=3;x<=10;x++) drawPixel(x,7+oy,BLACK);
    for (let x=2;x<=11;x++) drawPixel(x,8+oy,BLACK);
    for (let x=2;x<=11;x++) drawPixel(x,9+oy,BLACK);
    for (let x=2;x<=11;x++) drawPixel(x,10+oy,BLACK);
    for (let x=2;x<=11;x++) drawPixel(x,11+oy,BLACK);
    drawPixel(2,12+oy,DARK); drawPixel(3,12+oy,DARK); drawPixel(4,12+oy,DARK);
    drawPixel(9,12+oy,DARK); drawPixel(10,12+oy,DARK); drawPixel(11,12+oy,DARK);
  }

  function drawTail(oy, wag) {
    const offY = Math.round(Math.sin(wag));
    drawPixel(12,10+oy+offY,BLACK);
    drawPixel(13,9+oy+offY,BLACK);
    drawPixel(14,8+oy+offY,BLACK);
    drawPixel(15,8+oy+offY,DARK);
  }

  // Party hat for Konami dance
  function drawHat(oy) {
    // small triangular party hat above the ears
    drawPixel(6,-1+oy,HAT_TIP);  // tip
    drawPixel(5,0+oy,HAT_RED); drawPixel(6,0+oy,HAT_RED); drawPixel(7,0+oy,HAT_RED);
    drawPixel(5,1+oy,HAT_GOLD); drawPixel(6,1+oy,HAT_RED); drawPixel(7,1+oy,HAT_GOLD); drawPixel(8,1+oy,HAT_RED);
  }

  function drawTrackingEyes(oy) {
    let ex=0, ey=0;
    if (Math.abs(mouseRelX)>10) ex = mouseRelX>0?1:-1;
    if (Math.abs(mouseRelY)>10) ey = mouseRelY>0?1:0;
    const lx=4+ex, rx=8+ex, ty=3+ey;
    drawPixel(lx,ty+oy,EYE); drawPixel(lx+1,ty+oy,EYE);
    drawPixel(lx,ty+1+oy,EYE); drawPixel(lx+1,ty+1+oy,EYE);
    drawPixel(rx,ty+oy,EYE); drawPixel(rx+1,ty+oy,EYE);
    drawPixel(rx,ty+1+oy,EYE); drawPixel(rx+1,ty+1+oy,EYE);
    drawPixel(6,5+oy,NOSE); drawPixel(7,5+oy,NOSE);
  }

  function drawLookUpEyes(oy) {
    drawPixel(4,3+oy,EYE); drawPixel(5,3+oy,EYE);
    drawPixel(4,4+oy,EYE); drawPixel(5,4+oy,EYE);
    drawPixel(8,3+oy,EYE); drawPixel(9,3+oy,EYE);
    drawPixel(8,4+oy,EYE); drawPixel(9,4+oy,EYE);
    drawPixel(6,5+oy,NOSE); drawPixel(7,5+oy,NOSE);
  }

  function drawNormalEyes(oy, blink) {
    if (blink) {
      drawPixel(4,4+oy,DARK); drawPixel(5,4+oy,DARK);
      drawPixel(8,4+oy,DARK); drawPixel(9,4+oy,DARK);
    } else {
      drawPixel(4,3+oy,EYE); drawPixel(5,3+oy,EYE);
      drawPixel(4,4+oy,EYE); drawPixel(5,4+oy,EYE);
      drawPixel(8,3+oy,EYE); drawPixel(9,3+oy,EYE);
      drawPixel(8,4+oy,EYE); drawPixel(9,4+oy,EYE);
    }
    drawPixel(6,5+oy,NOSE); drawPixel(7,5+oy,NOSE);
  }

  function drawHappyEyes(oy) {
    drawPixel(4,3+oy,EYE); drawPixel(5,3+oy,EYE);
    drawPixel(3,4+oy,EYE); drawPixel(6,4+oy,EYE);
    drawPixel(8,3+oy,EYE); drawPixel(9,3+oy,EYE);
    drawPixel(7,4+oy,EYE); drawPixel(10,4+oy,EYE);
    drawPixel(6,5+oy,NOSE); drawPixel(7,5+oy,NOSE);
  }

  function drawSleepEyes(oy) {
    drawPixel(4,4+oy,DARK); drawPixel(5,4+oy,DARK);
    drawPixel(8,4+oy,DARK); drawPixel(9,4+oy,DARK);
    drawPixel(6,5+oy,NOSE); drawPixel(7,5+oy,NOSE);
  }

  function drawZzz(f) {
    const offset = Math.floor(f/10)%3;
    const alpha = ((f%10)/10);
    ctx.fillStyle = `rgba(142,200,255,${0.3+alpha*0.5})`;
    ctx.font = `${7+offset}px 'Press Start 2P',monospace`;
    ctx.fillText('z', (14-offset)*S, (CAT_OY-1+offset*2)*S);
  }

  // blueberry (3x3 pixel art)
  function drawBlueberry(bx, by) {
    drawPixel(bx,by,BERRY_LEAF); drawPixel(bx+1,by,BERRY_LEAF);
    drawPixel(bx,by+1,BERRY_DARK); drawPixel(bx+1,by+1,BERRY_MID); drawPixel(bx+2,by+1,BERRY_DARK);
    drawPixel(bx,by+2,BERRY_MID); drawPixel(bx+1,by+2,BERRY_LIGHT); drawPixel(bx+2,by+2,BERRY_MID);
    drawPixel(bx,by+3,BERRY_DARK); drawPixel(bx+1,by+3,BERRY_MID); drawPixel(bx+2,by+3,BERRY_DARK);
  }

  // pixel heart
  function drawHeart(px, py, alpha) {
    ctx.globalAlpha = alpha;
    const c = HEART;
    const x = Math.round(px), y = Math.round(py);
    drawPixel(x,y,c); drawPixel(x+2,y,c);
    drawPixel(x-1,y+1,c); drawPixel(x,y+1,c); drawPixel(x+1,y+1,c); drawPixel(x+2,y+1,c); drawPixel(x+3,y+1,c);
    drawPixel(x,y+2,c); drawPixel(x+1,y+2,c); drawPixel(x+2,y+2,c);
    drawPixel(x+1,y+3,c);
    ctx.globalAlpha = 1;
  }

  // pixel yarn ball
  function drawYarnBall(px, py, alpha, rot) {
    ctx.globalAlpha = alpha;
    const cx = Math.round(px), cy = Math.round(py);
    drawPixel(cx,cy,YARN); drawPixel(cx+1,cy,YARN2); drawPixel(cx+2,cy,YARN);
    drawPixel(cx,cy+1,YARN2); drawPixel(cx+1,cy+1,YARN); drawPixel(cx+2,cy+1,YARN2);
    drawPixel(cx,cy+2,YARN); drawPixel(cx+1,cy+2,YARN2); drawPixel(cx+2,cy+2,YARN);
    const sx = cx+2+Math.round(Math.sin(rot)*1.5);
    const sy = cy+2+Math.round(Math.cos(rot)*0.8);
    drawPixel(sx,sy,YARN2);
    drawPixel(sx+1,sy+1,YARN);
    ctx.globalAlpha = 1;
  }

  // ── render ──
  function render() {
    ctx.clearRect(0,0,CW,CH);
    frame++;
    tailWag += (state==='pet'||state==='track'||state==='dance') ? 0.3 : 0.12;

    blinkTimer++;
    if (blinkTimer>70 && !blinking) { blinking=true; blinkTimer=0; }
    if (blinking && blinkTimer>4) { blinking=false; blinkTimer=0; }

    if (berryCooldown>0) berryCooldown--;
    if (petCooldown>0) petCooldown--;

    // Konami dance trigger
    if (window.konamiActive && state !== 'dance') {
      state = 'dance';
      danceTimer = 0;
      lastInteraction = Date.now();
    }
    if (!window.konamiActive && state === 'dance') {
      state = mouseNear ? 'track' : 'idle';
      idleTimer = 0;
    }

    if (Date.now()-lastInteraction > SLEEP_AFTER && state!=='sleep' && state!=='lonely' && state!=='eat' && state!=='dance') {
      state='sleep'; idleTimer=0;
    }

    // blueberry physics
    if (berryActive) {
      berryVel += 0.18;
      berryY += berryVel;
      const landY = CAT_OY - 1;
      if (berryY >= landY) {
        berryY = landY;
        berryActive = false;
        state = 'eat';
        eatTimer = 0;
      }
    }

    // Dance bounce offset
    const danceOff = state === 'dance' ? Math.round(Math.sin(frame * 0.25) * 1.5) : 0;
    const oy = CAT_OY + danceOff;

    // draw cat
    drawCatBase(oy);
    drawBody(oy);
    drawTail(oy, tailWag);

    // Konami hat
    if (state === 'dance') {
      drawHat(oy);
    }

    // draw falling/landed blueberry
    if (berryActive) {
      drawBlueberry(6, Math.round(berryY));
    }

    switch (state) {
      case 'idle':
        drawNormalEyes(oy, blinking);
        idleTimer++;
        if (idleTimer>200) { state='sleep'; idleTimer=0; }
        break;

      case 'track':
        if (berryActive) {
          drawLookUpEyes(oy);
        } else {
          drawTrackingEyes(oy);
        }
        break;

      case 'pet':
        drawHappyEyes(oy);
        if (Math.random()<0.12) spawnHeart();
        idleTimer++;
        if (idleTimer>60) { state = mouseNear?'track':'idle'; idleTimer=0; }
        break;

      case 'eat':
        eatTimer++;
        if (eatTimer < 20) {
          drawLookUpEyes(oy);
          drawBlueberry(6, CAT_OY-1);
        } else if (eatTimer < 50) {
          drawHappyEyes(oy);
          if (eatTimer===20) spawnHeart();
        } else {
          state = mouseNear?'track':'idle';
          idleTimer=0;
        }
        break;

      case 'lonely':
        drawSleepEyes(oy);
        lonelyTimer++;
        if (lonelyTimer===1) spawnYarn();
        if (lonelyTimer>70) { state='idle'; idleTimer=0; }
        if (mouseNear) { state='track'; idleTimer=0; }
        break;

      case 'sleep':
        drawSleepEyes(oy);
        drawZzz(frame);
        break;

      case 'dance':
        drawHappyEyes(oy);
        danceTimer++;
        if (Math.random()<0.06) spawnHeart();
        break;
    }

    // particles
    for (let i=catParticles.length-1; i>=0; i--) {
      const p = catParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      const lifeAlpha = Math.max(0, p.life/p.maxLife);
      const edgeFade = Math.min(1, Math.max(0, (p.y * S) / (6 * S)));
      const alpha = lifeAlpha * edgeFade;
      if (p.type==='heart') {
        drawHeart(p.x, p.y, alpha);
      } else if (p.type==='yarn') {
        p.rot += 0.08;
        drawYarnBall(p.x, p.y, alpha, p.rot);
      }
      if (p.life<=0) catParticles.splice(i,1);
    }

    requestAnimationFrame(render);
  }

  render();
})();
