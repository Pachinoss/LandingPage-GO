(() => {
  'use strict';
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const ui = Object.fromEntries(['score', 'lives', 'level', 'overlay', 'overlay-label', 'overlay-title', 'overlay-copy', 'play', 'pause', 'restart', 'game-status'].map(id => [id, document.getElementById(id)]));
  const W = 800, H = 500, radius = 8, paddleY = 458, paddleWidth = 112;
  const colors = ['#a697ff', '#6285ff', '#45b7ed', '#8df0d4', '#f4ca83'];
  const keys = new Set();
  let state = 'intro', score = 0, lives = 3, level = 1, bricks = [], paddleX = (W - paddleWidth) / 2;
  let ball = { x: W / 2, y: paddleY - radius - 2, vx: 0, vy: 0 }, last = 0, pausedState = 'ready';

  function sync() {
    ui.score.textContent = score; ui.lives.textContent = lives; ui.level.textContent = level;
    ui.pause.disabled = !['ready', 'playing', 'paused'].includes(state);
    ui.pause.textContent = state === 'paused' ? 'Continuar' : 'Pausar';
  }
  function message(text) { ui['game-status'].textContent = text; }
  function overlay(label, title, copy, button) {
    ui['overlay-label'].textContent = label; ui['overlay-title'].textContent = title;
    ui['overlay-copy'].textContent = copy; ui.play.textContent = button;
    ui.overlay.hidden = false;
  }
  function buildBricks() {
    bricks = [];
    for (let row = 0; row < 5; row++) for (let col = 0; col < 10; col++) {
      bricks.push({ x: 31 + col * 75, y: 56 + row * 30, w: 63, h: 18, color: colors[row], alive: true });
    }
  }
  function ready() {
    paddleX = (W - paddleWidth) / 2;
    ball = { x: paddleX + paddleWidth / 2, y: paddleY - radius - 2, vx: 0, vy: 0 };
    state = 'ready'; ui.overlay.hidden = true;
    message('Espacio o toca el tablero para lanzar.'); sync();
  }
  function start() { score = 0; lives = 3; level = 1; keys.clear(); buildBricks(); ready(); canvas.focus({ preventScroll: true }); }
  function launch() {
    if (state !== 'ready') return;
    const speed = 330 + (level - 1) * 45;
    ball.vx = speed * .38; ball.vy = -speed * Math.sqrt(1 - .38 ** 2);
    state = 'playing'; message('¡Que no caiga la bola!'); sync();
  }
  function pause() {
    if (state === 'paused') {
      state = pausedState; ui.overlay.hidden = true; last = 0;
      message(state === 'ready' ? 'Espacio o toca el tablero para lanzar.' : '¡Seguimos!');
    } else if (state === 'playing' || state === 'ready') {
      pausedState = state; state = 'paused'; keys.clear();
      overlay('TÓMATE UN RESPIRO', 'Partida en pausa.', 'Tu partida te espera aquí.', 'Continuar');
      message('Partida en pausa.');
    }
    sync();
  }
  function advance(dt) {
    if (state !== 'playing' && state !== 'ready') return;
    const direction = Number(keys.has('ArrowRight') || keys.has('d')) - Number(keys.has('ArrowLeft') || keys.has('a'));
    paddleX = Math.max(0, Math.min(W - paddleWidth, paddleX + direction * 570 * dt));
    if (state === 'ready') { ball.x = paddleX + paddleWidth / 2; return; }
    // Small physics steps keep the ball from passing through thin bricks.
    const steps = Math.max(1, Math.ceil(Math.hypot(ball.vx, ball.vy) * dt / 4));
    for (let i = 0; i < steps && state === 'playing'; i++) {
      const prevX = ball.x, prevY = ball.y;
      ball.x += ball.vx * dt / steps; ball.y += ball.vy * dt / steps;
      if (ball.x < radius) { ball.x = radius; ball.vx = Math.abs(ball.vx); }
      if (ball.x > W - radius) { ball.x = W - radius; ball.vx = -Math.abs(ball.vx); }
      if (ball.y < radius) { ball.y = radius; ball.vy = Math.abs(ball.vy); }
      if (ball.vy > 0 && prevY + radius <= paddleY && ball.y + radius >= paddleY && ball.x + radius >= paddleX && ball.x - radius <= paddleX + paddleWidth) {
        const hit = Math.max(-1, Math.min(1, (ball.x - paddleX - paddleWidth / 2) / (paddleWidth / 2)));
        const angle = hit * Math.PI / 3, speed = Math.hypot(ball.vx, ball.vy);
        ball.vx = speed * Math.sin(angle); ball.vy = -speed * Math.cos(angle); ball.y = paddleY - radius;
      }
      for (const brick of bricks) {
        if (!brick.alive) continue;
        const nearX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.w));
        const nearY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.h));
        if ((ball.x - nearX) ** 2 + (ball.y - nearY) ** 2 > radius ** 2) continue;
        brick.alive = false; score += 10;
        if (prevY + radius <= brick.y || prevY - radius >= brick.y + brick.h) ball.vy *= -1;
        else ball.vx *= -1;
        ball.x = prevX; ball.y = prevY; sync();
        if (bricks.every(b => !b.alive)) {
          if (level < 3) {
            state = 'level'; overlay('¡TABLERO COMPLETADO!', 'Nivel superado.', `Llevas ${score} puntos. ¿Vamos a por el nivel ${level + 1}?`, 'Siguiente nivel');
            message('Nivel completado.');
          } else {
            state = 'won'; overlay('REFLEJOS EN PLENA FORMA', '¡Has ganado!', `Tres niveles y ${score} puntos. ¡Has roto todos los bloques! ¿Te animas a repetir?`, 'Jugar otra vez');
            message(`¡Victoria! ${score} puntos.`);
          }
          sync();
        }
        break;
      }
      if (ball.y - radius > H) {
        lives--;
        if (lives > 0) { ready(); message(`Te quedan ${lives} vidas. Espacio o toca para lanzar.`); }
        else {
          state = 'lost'; overlay('SIEMPRE HAY OTRA OPORTUNIDAD', '¿Otra partida?', `Has conseguido ${score} puntos. La próxima bola puede ser la buena.`, 'Volver a jugar');
          message(`Partida terminada: ${score} puntos.`); sync();
        }
      }
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1c2944';
    for (let x = 16; x < W; x += 28) for (let y = 16; y < H; y += 28) ctx.fillRect(x, y, 1, 1);
    for (const b of bricks) if (b.alive) {
      ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = '#ffffff36'; ctx.fillRect(b.x + 3, b.y + 2, b.w - 6, 2);
    }
    ctx.shadowBlur = 18; ctx.shadowColor = '#8df0d4'; ctx.fillStyle = '#8df0d4';
    ctx.fillRect(paddleX, paddleY, paddleWidth, 11);
    ctx.shadowBlur = 12; ctx.shadowColor = '#ffffff'; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
  }
  function frame(now) {
    const dt = last ? Math.min((now - last) / 1000, .04) : 0; last = now;
    advance(dt); draw(); requestAnimationFrame(frame);
  }
  function movePointer(event) {
    if (!['ready', 'playing'].includes(state)) return;
    const rect = canvas.getBoundingClientRect();
    paddleX = Math.max(0, Math.min(W - paddleWidth, (event.clientX - rect.left) * W / rect.width - paddleWidth / 2));
  }
  canvas.addEventListener('pointermove', movePointer);
  canvas.addEventListener('pointerdown', event => {
    if (!['ready', 'playing'].includes(state)) return;
    canvas.focus({ preventScroll: true }); canvas.setPointerCapture(event.pointerId); movePointer(event); launch();
  });
  document.addEventListener('keydown', event => {
    if (event.target !== canvas) return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd', 'p'].includes(key)) event.preventDefault();
    if (key === 'p' && !event.repeat) pause();
    else if (key === ' ') launch();
    else keys.add(key);
  });
  document.addEventListener('keyup', event => keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key));
  window.addEventListener('blur', () => { keys.clear(); if (['ready', 'playing'].includes(state)) pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && ['ready', 'playing'].includes(state)) pause(); });
  ui.play.addEventListener('click', () => {
    if (state === 'paused') pause();
    else if (state === 'level') { level++; buildBricks(); ready(); }
    else start();
    canvas.focus({ preventScroll: true });
  });
  ui.pause.addEventListener('click', () => { pause(); if (state !== 'paused') canvas.focus({ preventScroll: true }); });
  ui.restart.addEventListener('click', start);
  buildBricks(); sync(); requestAnimationFrame(frame);
})();
