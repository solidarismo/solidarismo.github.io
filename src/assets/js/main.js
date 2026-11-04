(() => {
  const init = () => {
    const header = document.querySelector(".site-header");
    const menuToggle = header && header.querySelector(".menu-toggle");

    if (header) {
      const closeMenu = () => {
        header.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      };

      if (menuToggle) {
        menuToggle.addEventListener("click", () => {
          const isOpen = header.classList.toggle("is-open");
          menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        document.addEventListener("click", (event) => {
          if (!header.contains(event.target)) closeMenu();
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", () => {
          if (window.innerWidth > 920) closeMenu();
        });
      }

      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    const progress = document.querySelector(".reading-progress");
    const longArticle = document.querySelector(".document-article, .ethics-article, .manifesto article");

    if (progress && longArticle) {
      const updateProgress = () => {
        const rect = longArticle.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const ratio = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
        progress.style.transform = `scaleX(${ratio})`;
      };
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
      updateProgress();
    }

    const tocLinks = [...document.querySelectorAll(".toc-list a, .indice a")];
    const targets = tocLinks
      .map((link) => {
        const id = decodeURIComponent((link.getAttribute("href") || "").replace(/^#/, ""));
        const target = id && document.getElementById(id);
        return target ? { link, target } : null;
      })
      .filter(Boolean);

    if (targets.length && "IntersectionObserver" in window) {
      const visible = new Set();
      const setActive = () => {
        const current = targets.filter(({ target }) => visible.has(target)).pop() ||
          targets.filter(({ target }) => target.getBoundingClientRect().top < 120).pop();
        tocLinks.forEach((link) => link.classList.remove("is-active"));
        if (current) current.link.classList.add("is-active");
      };
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visible.add(entry.target);
            else visible.delete(entry.target);
          });
          setActive();
        },
        { rootMargin: "-80px 0px -60% 0px" }
      );
      targets.forEach(({ target }) => observer.observe(target));
    }

    document.querySelectorAll("[data-copy]").forEach((button) => {
      const label = button.textContent;
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.copy);
          button.textContent = "Copiado!";
          button.classList.add("is-copied");
        } catch {
          button.textContent = "Selecione e copie";
        }
        setTimeout(() => {
          button.textContent = label;
          button.classList.remove("is-copied");
        }, 2000);
      });
    });

    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length && "IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      reveals.forEach((el) => revealObserver.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("is-visible"));
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
