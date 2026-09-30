(function () {
  "use strict";

  function closeMobileNav(link) {
    var nav = document.getElementById("navMain");
    if (!nav || !nav.classList.contains("show")) return;
    var collapse = window.bootstrap && window.bootstrap.Collapse.getOrCreateInstance(nav);
    if (collapse && link.getAttribute("href").startsWith("#")) collapse.hide();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", link.getAttribute("href"));
        closeMobileNav(link);
      });
    });

    var revealItems = document.querySelectorAll(".reveal");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index * 55, 360) + "ms";
      observer.observe(item);
    });

    var navLinks = document.querySelectorAll(".site-header .nav-link");
    var sections = Array.from(navLinks)
      .map(function (link) { return document.querySelector(link.getAttribute("href")); })
      .filter(Boolean);

    var activeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function(link) { link.classList.remove("active"); });
        var active = document.querySelector('.site-header .nav-link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add("active");
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });

    sections.forEach(function(section) { activeObserver.observe(section); });
  });
})();

document.querySelectorAll("[data-custom-select]").forEach(function (select) {
  var toggle = select.querySelector(".custom-select-toggle");
  var label = select.querySelector(".custom-select-toggle span");
  var hiddenInput = select.querySelector('input[type="hidden"]');
  var options = select.querySelectorAll(".custom-select-option");

  if (!toggle || !label) return;

  toggle.addEventListener("click", function () {
    document.querySelectorAll("[data-custom-select]").forEach(function (otherSelect) {
      if (otherSelect !== select) {
        otherSelect.classList.remove("is-open");

        var otherToggle = otherSelect.querySelector(".custom-select-toggle");
        if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
      }
    });

    var isOpen = select.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  options.forEach(function (option) {
    option.addEventListener("click", function () {
      var value = option.getAttribute("data-value");

      label.textContent = value;
      if (hiddenInput) hiddenInput.value = value;

      options.forEach(function (item) {
        item.classList.remove("active");
      });

      option.classList.add("active");
      select.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});

document.addEventListener("click", function (event) {
  if (event.target.closest("[data-custom-select]")) return;

  document.querySelectorAll("[data-custom-select]").forEach(function (select) {
    select.classList.remove("is-open");

    var toggle = select.querySelector(".custom-select-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
});