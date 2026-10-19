/* =========================================
   PORTFOLIO WEBSITE — app.js
   Features:
   1. Mobile navigation
   2. Scroll progress indicator
   3. Back-to-top button
   4. Project category filters
   5. Scroll reveal animations
   6. Current year
   7. Image fallback
   8. Smooth scrolling
   9. Active navigation link
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // =========================================
  // 1. MOBILE NAVIGATION
  // =========================================

  const menuToggle = document.querySelector(
    ".menu-toggle, .nav-toggle, #menu-toggle"
  );

  const navigation = document.querySelector(
    ".nav-links, .navigation, #nav-links"
  );

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("active");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    // Close the mobile menu after clicking a navigation link.
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
      if (
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navigation.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });

    // Close the menu with Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navigation.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });
  }

  // =========================================
  // 2. SCROLL PROGRESS INDICATOR
  // =========================================

  let progressBar = document.querySelector(
    ".scroll-progress, #scroll-progress, .progress-bar"
  );

  function updateScrollProgress() {
    if (!progressBar) return;

    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop;

    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress =
      scrollHeight > 0
        ? (scrollTop / scrollHeight) * 100
        : 0;

    progressBar.style.width = `${progress}%`;
    progressBar.style.transform = `scaleX(${progress / 100})`;
    progressBar.style.transformOrigin = "left";
  }

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true
  });

  updateScrollProgress();

  // =========================================
  // 3. BACK-TO-TOP BUTTON
  // =========================================

  const backToTop = document.querySelector(
    ".back-to-top, #back-to-top, .back-top"
  );

  function updateBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
      backToTop.classList.add("show");
      backToTop.setAttribute("aria-hidden", "false");
    } else {
      backToTop.classList.remove("visible");
      backToTop.classList.remove("show");
      backToTop.setAttribute("aria-hidden", "true");
    }
  }

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    updateBackToTop();

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });
  }

  // =========================================
  // 4. PROJECT CATEGORY FILTERS
  // =========================================

  const filterButtons = document.querySelectorAll(
    ".filter-btn, .project-filter, [data-filter]"
  );

  const projectCards = document.querySelectorAll(
    ".project-card, .project-item, [data-category]"
  );

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedFilter =
          button.dataset.filter ||
          button.getAttribute("data-filter") ||
          "all";

        // Update the active filter button.
        filterButtons.forEach((item) => {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        // Show or hide matching project cards.
        projectCards.forEach((card) => {
          const category =
            card.dataset.category ||
            card.getAttribute("data-category") ||
            "all";

          const shouldShow =
            selectedFilter === "all" ||
            selectedFilter === "*" ||
            category === selectedFilter ||
            category
              .split(" ")
              .includes(selectedFilter);

          card.hidden = !shouldShow;

          if (shouldShow) {
            card.classList.remove("filtered-out");
          } else {
            card.classList.add("filtered-out");
          }
        });
      });
    });
  }

  // =========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // =========================================

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-up, .fade-in, .project-card, .timeline-item"
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible", "revealed", "show");
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "visible",
              "revealed",
              "show"
            );

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // =========================================
  // 6. AUTOMATICALLY UPDATE THE FOOTER YEAR
  // =========================================

  const yearElements = document.querySelectorAll(
    "#year, .current-year, [data-current-year]"
  );

  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // =========================================
  // 7. BROKEN IMAGE FALLBACK
  // =========================================

  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("error", () => {
      // Avoid repeatedly handling the same failed image.
      if (img.dataset.fallbackApplied === "true") return;

      img.dataset.fallbackApplied = "true";
      img.classList.add("image-unavailable");

      // Hide broken images gracefully.
      img.style.visibility = "hidden";
    });
  });

  // =========================================
  // 8. SMOOTH SCROLLING FOR INTERNAL LINKS
  // =========================================

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      // Update the URL hash without jumping.
      if (history.replaceState) {
        history.replaceState(null, "", targetId);
      }
    });
  });

  // =========================================
  // 9. ACTIVE NAVIGATION LINK ON SCROLL
  // =========================================

  const sections = document.querySelectorAll(
    "section[id], main[id]"
  );

  const navLinks = document.querySelectorAll(
    ".nav-links a[href^='#'], .navigation a[href^='#']"
  );

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const activeId = `#${entry.target.id}`;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === activeId;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        threshold: 0,
        rootMargin: "-35% 0px -55% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // =========================================
  // 10. CONTACT FORM BASIC VALIDATION
  // =========================================

  const contactForm = document.querySelector(
    "#contact-form, .contact-form"
  );

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      const emailInput = contactForm.querySelector(
        'input[type="email"]'
      );

      const requiredFields = contactForm.querySelectorAll(
        "[required]"
      );

      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim() || !field.checkValidity()) {
          field.reportValidity();
          isValid = false;
        }
      });

      if (emailInput && emailInput.value.trim()) {
        if (!emailInput.checkValidity()) {
          emailInput.reportValidity();
          isValid = false;
        }
      }

      if (!isValid) {
        event.preventDefault();
      }

      /*
        Important:
        This validates the form only.
        To actually send messages, connect a form
        backend or an email service.
      */
    });
  }

  // =========================================
  // 11. CURRENT YEAR AND INITIAL PAGE STATE
  // =========================================

  document.documentElement.classList.add("js-enabled");

  // Avoid showing content as hidden if no animation
  // class is present in the stylesheet.
  document.querySelectorAll(".reveal, .reveal-up, .fade-in")
    .forEach((element) => {
      element.style.willChange = "opacity, transform";
    });

  console.log("Portfolio website JavaScript loaded successfully.");
});
