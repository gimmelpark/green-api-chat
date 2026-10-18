export function initViewportSize() {
  const viewport = window.visualViewport;

  if (!viewport) return;

  const root = document.documentElement;

  function update() {
    if (!viewport) return;

    root.style.setProperty("--app-height", `${viewport.height}px`);
    root.style.setProperty("--app-offset-top", `${viewport.offsetTop}px`);
  }

  update();

  viewport.addEventListener("resize", update);
  viewport.addEventListener("scroll", update);
}
