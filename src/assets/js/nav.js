/**
 * Mobile navigation drawer and scroll-spy.
 *
 * Open/closed state lives entirely in `aria-expanded` on the toggle button,
 * mirrored onto the menu with a `data-open` attribute for styling. There is
 * no separate `.active` class to fall out of sync with assistive tech.
 */

const DESKTOP = window.matchMedia("(min-width: 52.0625em)");

function initDrawer() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.dataset.open = String(open);
    // Lock the page behind the drawer without the layout shift that
    // toggling `overflow` on <body> alone can cause.
    document.documentElement.style.overflow = open ? "hidden" : "";
  };

  const close = () => setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Any navigation dismisses the drawer.
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      close();
      toggle.focus();
    }
  });

  // Returning to the desktop breakpoint must not leave the page scroll-locked.
  DESKTOP.addEventListener("change", (event) => {
    if (event.matches) close();
  });

  setOpen(false);
}

/**
 * Marks the nav link for the section currently in view.
 *
 * Uses IntersectionObserver rather than recomputing `offsetTop` for every
 * section on every scroll event, which forced a synchronous layout on each
 * frame in the previous implementation.
 */
function initScrollSpy() {
  const links = new Map();
  document.querySelectorAll("[data-nav-hash]").forEach((link) => {
    links.set(link.dataset.navHash, link);
  });
  if (links.size === 0) return;

  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (sections.length === 0) return;

  const visible = new Set();

  // On the home page the "Home" link doubles as the indicator for "above the
  // first section", so the spy owns it too. Without this it would keep its
  // static aria-current="page" and light up alongside the active section.
  const homeLink = document.querySelector("[data-nav-home]");

  const highlight = () => {
    // Of everything on screen, mark the one nearest the top of the viewport.
    let best = null;
    let bestTop = Infinity;
    for (const id of visible) {
      const top = document.getElementById(id).getBoundingClientRect().top;
      if (top < bestTop) {
        bestTop = top;
        best = id;
      }
    }
    for (const [id, link] of links) {
      if (id === best) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
    if (homeLink) {
      if (best) homeLink.removeAttribute("aria-current");
      else homeLink.setAttribute("aria-current", "page");
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      highlight();
    },
    // Bias the active band towards the top of the viewport, just under the
    // sticky nav, so the highlight tracks what the reader is actually on.
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

export function initNav() {
  initDrawer();
  initScrollSpy();
}
