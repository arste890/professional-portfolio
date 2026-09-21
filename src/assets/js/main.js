/**
 * Entry point. Bundled by esbuild into /assets/js/main.js.
 *
 * Every initialiser is defensive: if the markup a module needs is absent from
 * the current page it returns immediately, so one bundle serves all pages.
 */

import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initAccordions } from "./accordion.js";
import { initDialogs } from "./dialog.js";
import { initLightbox } from "./lightbox.js";
import { initToTop } from "./to-top.js";

function start() {
  initTheme();
  initNav();
  initAccordions();
  initDialogs();
  initLightbox();
  initToTop();

  // Stamp the copyright year without an extra render pass.
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
