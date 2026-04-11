// Legacy entrypoint kept for compatibility with existing HTML files.
// The real script lives in src/assets/js/main.js.
(() => {
  const script = document.createElement("script");
  script.src = "src/assets/js/main.js";
  script.defer = true;
  document.head.appendChild(script);
})();
