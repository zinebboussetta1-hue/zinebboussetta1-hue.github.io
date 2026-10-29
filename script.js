
/* =========================================
   ZINEB BOUSSETTA — INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments
  const body = document.body;
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const typedText = document.getElementById("typedText");
  const progressBar = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const currentYear = document.getElementById("currentYear");

  // Année automatique dans le pied de page
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // -----------------------------------------
  // 1. MENU MOBILE
  // -----------------------------------------

  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Fermer le menu si on revient à la version ordinateur
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  // -----------------------------------------
  // 2. MODE SOMBRE / MODE CLAIR
  // -----------------------------------------

  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
  }

  function updateThemeButton() {
    const isDark = body.classList.contains("dark-theme");

    themeIcon.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Activer le mode clair" : "Activer le mode sombre"
    );
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#171421" : "#f8f5ff");
  }

  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-theme");

    const theme = body.classList.contains("dark-theme")
      ? "dark"
      : "light";

    localStorage.setItem("portfolio-theme", theme);
    updateThemeButton();
  });

  // -----------------------------------------
  // 3. TEXTE ANIMÉ
  // -----------------------------------------

  if (typedText) {
    const words = [
      "développement web",
      "création numérique",
      "résolution de problèmes",
      "apprentissage continu"
    ];

    let wordIndex = 0;
    let characterIndex = words[0].length;
    let deleting = true;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (deleting) {
        characterIndex--;
      } else {
        characterIndex++;
      }

      typedText.textContent = currentWord.slice(
        0,
        Math.max(0, characterIndex)
      );

      let delay = deleting ? 45 : 85;

      if (deleting && characterIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
      } else if (!deleting && characterIndex >= words[wordIndex].length) {
        deleting = true;
        delay = 1500;
      }

      window.setTimeout(typeEffect, delay);
    }

    // Laisser le premier texte visible avant de commencer
    window.setTimeout(typeEffect, 1800);
  }

  // -----------------------------------------
  // 4. ANIMATIONS AU DÉFILEMENT
  // -----------------------------------------

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // -----------------------------------------
  // 5. FILTRES DES PROJETS
  // -----------------------------------------

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      // Mettre à jour le filtre actif
      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      // Afficher les projets correspondants
      projectCards.forEach((card) => {
        const category = card.dataset.category;

        const shouldShow =
          selectedFilter === "all" ||
          category === selectedFilter;

        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  // État initial des boutons de filtre
  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  // -----------------------------------------
  // 6. BARRE DE PROGRESSION ET RETOUR EN HAUT
  // -----------------------------------------

  let ticking = false;

  function updateScrollElements() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

    progressBar.style.width = `${progress}%`;

    backToTop.classList.toggle("visible", window.scrollY > 450);

    // Navigation active selon la section visible
    const sections = document.querySelectorAll("main section[id]");
    let currentSection = "home";

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 180) {
        currentSection = section.id;
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSection}`;
      link.classList.toggle("active", isActive);
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollElements);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateScrollElements();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  });

  // -----------------------------------------
  // 7. FORMULAIRE DE CONTACT
  // -----------------------------------------

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formMessage.textContent =
        "Merci de remplir tous les champs avant de continuer.";
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formMessage.textContent =
        "Vérifiez votre adresse e-mail puis réessayez.";
      return;
    }

    /*
      Remplace cette adresse par ton adresse e-mail professionnelle
      avant de publier le portfolio.
    */
    const destination = "TON-EMAIL@EXEMPLE.COM";

    if (destination === "TON-EMAIL@EXEMPLE.COM") {
      formMessage.textContent =
        "Le formulaire fonctionne, mais configure d'abord ton adresse e-mail dans script.js.";
      return;
    }

    const subject = encodeURIComponent(
      `Message de portfolio — ${name}`
    );

    const bodyText = encodeURIComponent(
      `Bonjour Zineb,\n\n${message}\n\nNom : ${name}\nE-mail : ${email}`
    );

    formMessage.textContent =
      "Ouverture de votre application de messagerie...";

    window.location.href =
      `mailto:${destination}?subject=${subject}&body=${bodyText}`;
  });

  // -----------------------------------------
  // 8. LIENS GITHUB PERSONNALISABLES
  // -----------------------------------------

  /*
    Une fois ton compte GitHub créé, remplace le lien générique
    par ton véritable profil.
  */

  const githubUsername = "";

  if (githubUsername.trim()) {
    const githubURL =
      `https://github.com/${encodeURIComponent(githubUsername.trim())}`;

    ["githubProfileLink", "githubContactLink"].forEach((id) => {
      const link = document.getElementById(id);

      if (link) {
        link.href = githubURL;
      }
    });
  }

});
