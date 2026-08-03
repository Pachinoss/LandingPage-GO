(function () {
  "use strict";

  // ======== Menú móvil ========
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-active", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    menu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ======== Sombra del header al hacer scroll ========
  var header = document.getElementById("header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  // ======== Animación reveal al entrar en viewport ========
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

    revealEls.forEach(function (el, i) {
      el.style.setProperty("--d", (i % 4 * 70) + "ms");
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  // ======== Enlace activo en navegación ========
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav__link[href^='#']");

  function onScrollSpy() {
    var pos = window.scrollY + 120;
    var currentId = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) currentId = sec.getAttribute("id");
    });
    navLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("is-active-link", active);
    });
  }
  window.addEventListener("scroll", onScrollSpy, { passive: true });
  onScrollSpy();

  // ======== Año dinámico en el footer ========
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();