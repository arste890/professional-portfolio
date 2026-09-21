/**
 * Disclosure rows for the Experience and Leadership sections.
 *
 * The trigger is a real <button aria-expanded aria-controls>, so it is
 * reachable by Tab, operable with Enter/Space and announced correctly. The
 * panel animates via grid-template-rows, which needs no measured height.
 */

export function initAccordions() {
  const triggers = document.querySelectorAll("[data-accordion-trigger]");
  if (triggers.length === 0) return;

  triggers.forEach((trigger) => {
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls")
    );
    if (!panel) return;

    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      panel.dataset.open = String(!open);
      // `inert` keeps links inside a collapsed panel out of the tab order
      // even while the closing transition is still running.
      panel.inert = open;
    });

    // Establish the closed state from markup on first paint.
    const open = trigger.getAttribute("aria-expanded") === "true";
    panel.dataset.open = String(open);
    panel.inert = !open;
  });
}
