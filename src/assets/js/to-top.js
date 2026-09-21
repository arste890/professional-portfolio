/**
 * Back-to-top control.
 *
 * Visibility is driven by an IntersectionObserver on a sentinel at the top of
 * the document instead of a scroll listener, so nothing runs per frame.
 */

export function initToTop() {
  const button = document.querySelector("[data-to-top]");
  if (!button) return;

  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:600px;pointer-events:none;";
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    ([entry]) => {
      button.dataset.visible = String(!entry.isIntersecting);
    },
    { threshold: 0 }
  );
  observer.observe(sentinel);

  button.addEventListener("click", () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    // Send focus somewhere sensible rather than leaving it on a button that
    // is about to disappear.
    document.querySelector("a.skip-link")?.focus({ preventScroll: true });
  });

  button.dataset.visible = "false";
}
