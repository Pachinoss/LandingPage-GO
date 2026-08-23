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
    if (window.scrollY > 50) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  // ======== Carousel Simple ========
  var carousel = document.getElementById("carousel");
  if (carousel) {
    var slides = carousel.querySelectorAll(".carousel__slide");
    var currentSlide = 0;

    function nextSlide() {
      slides[currentSlide].classList.remove("is-active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("is-active");
    }

    setInterval(nextSlide, 4000);
  }

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

  // ======== Gestión del Modal ========
  var modal = document.getElementById("demo-modal");
  var openBtns = document.querySelectorAll(".open-modal-trigger");
  var closeBtn = document.getElementById("close-modal");

  function openModal() {
    if (modal) modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (modal) modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  openBtns.forEach(function(btn) {
    btn.addEventListener("click", openModal);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal) closeModal();
    });
  }

  // ======== Envío del Formulario (Web3Forms) ========
  var form = document.getElementById("demo-form");
  var status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var formData = new FormData(form);
      var object = Object.fromEntries(formData);
      var json = JSON.stringify(object);

      if (status) {
        status.textContent = "Enviando...";
        status.style.color = "var(--c-text)";
      }

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: json
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          if (status) {
            status.textContent = "¡Solicitud enviada con éxito! Te contactaremos pronto.";
            status.style.color = "#22c55e";
          }
          form.reset();
          setTimeout(closeModal, 3000);
        } else {
          console.log(response);
          if (status) {
            status.textContent = json.message;
            status.style.color = "#ef4444";
          }
        }
      })
      .catch((error) => {
        console.log(error);
        if (status) status.textContent = "Algo salió mal. Por favor, inténtalo de nuevo.";
      });
    });
  }
})();