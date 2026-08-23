(function () {
  "use strict";

  /* ======== Menú móvil ======== */
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-active", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = open ? "hidden" : "";
    });

    menu.querySelectorAll(".nav__link, .open-modal-trigger").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-active");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-active");
        document.body.style.overflow = "";
      }
    });
  }

  /* ======== Año dinámico ======== */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ======== Carrusel del proyecto estrella ======== */
  var slides = document.querySelectorAll(".carousel__slide");
  var dots = document.querySelectorAll(".carousel__dot");

  if (slides.length > 1) {
    var current = 0;
    var interval = 4000;

    function showSlide(index) {
      slides[current].classList.remove("is-active");
      if (dots[current]) dots[current].classList.remove("is-active");
      current = index;
      slides[current].classList.add("is-active");
      if (dots[current]) dots[current].classList.add("is-active");
    }

    setInterval(function () {
      showSlide((current + 1) % slides.length);
    }, interval);
  }
})();