(() => {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const toggleScrolled = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  const menuToggle = nav.querySelector(".menu-toggle");
  const navList = nav.querySelector(".nav-list");

  const closeMenu = () => {
    if (!menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!menuToggle) return;
    nav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
  };

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  window.addEventListener("scroll", toggleScrolled, { passive: true });
  window.addEventListener("load", toggleScrolled);
})();
