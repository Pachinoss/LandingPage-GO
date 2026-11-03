(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var toggle = document.getElementById('nav-toggle'), nav = document.getElementById('nav-menu');
  if (toggle && nav) { toggle.addEventListener('click', function () { var open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); document.body.style.overflow = open ? 'hidden' : ''; }); nav.querySelectorAll('a,.open-modal-trigger').forEach(function (item) { item.addEventListener('click', function () { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); document.body.style.overflow = ''; }); }); }
  var year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
  document.querySelectorAll('.project-carousel').forEach(function (carousel) {
    var slides = carousel.querySelectorAll('.project-slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var counter = carousel.querySelector('.carousel-counter');
    var viewport = carousel.querySelector('.carousel-viewport');
    var current = 0, pointerStart = null, timer = null, hovering = false, focused = false, finishTransition = null;
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var autoplay = !motion.matches;
    var playback = document.createElement('button');
    playback.type = 'button';
    playback.className = 'carousel-playback';
    carousel.querySelector('.carousel-controls').insertBefore(playback, counter);
    function schedule() {
      clearTimeout(timer);
      playback.textContent = autoplay ? 'Pausar' : 'Reproducir';
      playback.setAttribute('aria-label', (autoplay ? 'Pausar' : 'Reproducir') + ' carrusel: ' + carousel.getAttribute('aria-label'));
      if (autoplay && !hovering && !focused && !document.hidden && !pointerStart) {
        timer = setTimeout(function () { show(current + 1, true); }, 5000);
      }
    }
    function show(index, automatic) {
      var next = (index + slides.length) % slides.length;
      if (finishTransition) finishTransition();
      if (next === current) { schedule(); return; }
      var outgoing = slides[current], incoming = slides[next];
      var direction = index > current ? 1 : -1;
      current = next;
      incoming.hidden = false;
      outgoing.setAttribute('aria-hidden', 'true');
      incoming.setAttribute('aria-hidden', 'false');
      if (!motion.matches && typeof incoming.animate === 'function') {
        var options = { duration: 450, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' };
        var animations = [
          outgoing.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + (-direction * 100) + '%)' }], options),
          incoming.animate([{ transform: 'translateX(' + (direction * 100) + '%)' }, { transform: 'translateX(0)' }], options)
        ];
        var finish = function () {
          animations.forEach(function (animation) { animation.cancel(); });
          slides.forEach(function (slide, i) { slide.hidden = i !== current; slide.setAttribute('aria-hidden', String(i !== current)); });
          finishTransition = null;
        };
        finishTransition = finish;
        Promise.all(animations.map(function (animation) { return animation.finished; })).then(function () {
          if (finishTransition === finish) finish();
        }).catch(function () { /* A new selection can cancel the previous transition. */ });
      } else {
        slides.forEach(function (slide, i) { slide.hidden = i !== current; slide.setAttribute('aria-hidden', String(i !== current)); });
      }
      dots.forEach(function (dot, i) { dot.setAttribute('aria-current', String(i === current)); });
      counter.setAttribute('aria-live', automatic ? 'off' : 'polite');
      counter.textContent = (current + 1) + ' / ' + slides.length;
      schedule();
    }
    playback.addEventListener('click', function () { autoplay = !autoplay; schedule(); });
    carousel.addEventListener('mouseenter', function () { hovering = true; schedule(); });
    carousel.addEventListener('mouseleave', function () { hovering = false; schedule(); });
    carousel.addEventListener('focusin', function () { focused = true; schedule(); });
    carousel.addEventListener('focusout', function (event) { focused = carousel.contains(event.relatedTarget); schedule(); });
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', function (event) { autoplay = !event.matches; schedule(); });
    carousel.querySelectorAll('[data-direction]').forEach(function (button) {
      button.addEventListener('click', function () { show(current + Number(button.dataset.direction)); });
    });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { show(i); }); });
    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    viewport.addEventListener('pointerdown', function (event) {
      if (!event.isPrimary || event.button !== 0) return;
      pointerStart = { x: event.clientX, y: event.clientY };
      schedule();
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointerup', function (event) {
      if (!pointerStart) return;
      var dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
      pointerStart = null;
      schedule();
    });
    viewport.addEventListener('pointercancel', function () { pointerStart = null; schedule(); });
    viewport.addEventListener('dragstart', function (event) { event.preventDefault(); });
    schedule();
  });
  var modal = document.getElementById('contact-modal'), close = document.getElementById('close-modal');
  function setModal(open) { if (!modal) return; modal.classList.toggle('is-open', open); modal.setAttribute('aria-hidden', String(!open)); document.body.style.overflow = open ? 'hidden' : ''; if (open) { var first = modal.querySelector('input[name="name"]'); if (first) setTimeout(function () { first.focus(); }, 150); } }
  document.querySelectorAll('.open-modal-trigger').forEach(function (btn) { btn.addEventListener('click', function () { setModal(true); }); });
  if (close) close.addEventListener('click', function () { setModal(false); }); if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) setModal(false); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setModal(false); });
  var form = document.getElementById('contact-form'), status = document.getElementById('form-status'); if (form) form.addEventListener('submit', function (e) { e.preventDefault(); status.textContent = 'Enviando...'; fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } }).then(function (res) { if (!res.ok) throw new Error(); return res.json(); }).then(function () { status.textContent = 'Mensaje enviado. Te responderé lo antes posible.'; form.reset(); }).catch(function () { status.textContent = 'No se ha podido enviar. Escríbeme directamente por email.'; }); });
  if ('IntersectionObserver' in window) { var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: .12 }); document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); }); } else { document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); }); }
})();
