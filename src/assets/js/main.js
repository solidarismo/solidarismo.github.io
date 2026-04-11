(() => {
  const nav = document.querySelector("nav");
  if (!nav) return;

  const title = nav.querySelector("div");
  const toggle = () => {
    const isFixed = window.scrollY >= 300;
    nav.classList.toggle("fixed-header", isFixed);
    if (title) title.classList.toggle("visible-title", isFixed);
  };

  window.addEventListener("scroll", toggle, { passive: true });
  window.addEventListener("load", toggle);
})();
