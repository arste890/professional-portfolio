/**
 * Colour theme switching.
 *
 * The *initial* theme is applied by a small blocking snippet in <head> so the
 * page never flashes the wrong palette. This module only owns the toggle and
 * keeps the choice in sync with the OS while the user has no explicit
 * preference stored.
 */

const STORAGE_KEY = "theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");

/** @returns {"light"|"dark"} the palette actually on screen right now. */
function resolvedTheme() {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return media.matches ? "dark" : "light";
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private browsing or blocked storage — the theme still applies for
    // this page view, it simply won't be remembered.
  }
}

export function initTheme() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const sync = () => {
    const current = resolvedTheme();
    toggle.setAttribute(
      "aria-label",
      current === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    toggle.setAttribute("aria-pressed", String(current === "dark"));
  };

  toggle.addEventListener("click", () => {
    apply(resolvedTheme() === "dark" ? "light" : "dark");
    sync();
  });

  // Follow the system only while the visitor has not chosen for themselves.
  media.addEventListener("change", () => {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable; fall through to the system preference */
    }
    if (!stored) sync();
  });

  sync();
}
