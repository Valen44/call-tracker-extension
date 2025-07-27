// preloadTheme.ts
(() => {

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const theme = prefersDark ? "dark" : "light"

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  }
})();