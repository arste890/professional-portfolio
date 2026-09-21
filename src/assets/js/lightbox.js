/**
 * Media lightbox.
 *
 * Reads its content from a JSON manifest embedded in the page rather than
 * from data-* attributes scattered across the tiles, and builds every node
 * with the DOM API. The previous implementation concatenated caption text
 * straight into an innerHTML template, so any apostrophe or angle bracket in
 * a title could break the markup.
 */

import { openDialog } from "./dialog.js";

const SWIPE_THRESHOLD = 50;

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

export function initLightbox() {
  const manifestNode = document.querySelector("[data-media-manifest]");
  const dialog = document.getElementById("media-dialog");
  if (!manifestNode || !dialog) return;

  /** @type {Array<object>} */
  let items = [];
  try {
    items = JSON.parse(manifestNode.textContent);
  } catch {
    return; // Malformed manifest — leave the tiles as plain, inert markup.
  }

  const mediaSlot = dialog.querySelector("[data-dialog-media]");
  const bodySlot = dialog.querySelector("[data-dialog-body]");
  const prevButton = dialog.querySelector("[data-dialog-prev]");
  const nextButton = dialog.querySelector("[data-dialog-next]");

  let index = 0;
  let slide = 0;

  /** Builds the media area for one manifest entry. */
  function renderMedia(item) {
    mediaSlot.replaceChildren();

    if (item.type === "video") {
      const video = el("video");
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute("title", item.alt || item.title);
      mediaSlot.append(video);
      return;
    }

    if (item.type === "instagram-carousel" && Array.isArray(item.slides)) {
      const carousel = el("div", "carousel");
      item.slides.forEach((src, i) => {
        const wrap = el("div", "carousel__slide");
        wrap.dataset.active = String(i === slide);
        if (src.endsWith(".mp4")) {
          const video = el("video");
          video.src = src;
          video.controls = true;
          video.playsInline = true;
          wrap.append(video);
        } else {
          const img = el("img");
          img.src = src;
          img.alt = `${item.title} — slide ${i + 1} of ${item.slides.length}`;
          wrap.append(img);
        }
        carousel.append(wrap);
      });

      const dots = el("div", "carousel__dots");
      dots.setAttribute("role", "tablist");
      dots.setAttribute("aria-label", "Carousel slides");
      item.slides.forEach((_, i) => {
        const dot = el("button", "carousel__dot");
        dot.type = "button";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Slide ${i + 1}`);
        dot.setAttribute("aria-current", String(i === slide));
        dot.addEventListener("click", () => {
          slide = i;
          renderMedia(item);
        });
        dots.append(dot);
      });
      carousel.append(dots);
      mediaSlot.append(carousel);
      return;
    }

    const img = el("img");
    img.src = item.src;
    img.alt = item.alt || item.title;
    mediaSlot.append(img);
  }

  /** Builds the caption area for one manifest entry. */
  function renderBody(item) {
    bodySlot.replaceChildren();

    const title = el("h2", "dialog__title", item.modalTitle || item.title);
    title.id = "media-dialog-title";
    bodySlot.append(title);

    if (item.description) {
      bodySlot.append(el("p", "dialog__subtitle", "Description"));
      bodySlot.append(el("p", "dialog__text", item.description));
    }

    if (item.instagramUrl) {
      const footer = el("div", "dialog__footer");
      const link = el("a", "button button--secondary", "View Instagram post");
      link.href = item.instagramUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      footer.append(link);
      bodySlot.append(footer);
    }
  }

  function show(next, resetSlide = true) {
    index = (next + items.length) % items.length;
    if (resetSlide) slide = 0;
    const item = items[index];

    renderMedia(item);
    renderBody(item);

    const many = items.length > 1;
    prevButton.hidden = !many;
    nextButton.hidden = !many;
    dialog.querySelector("[data-dialog-scroll]")?.scrollTo({ top: 0 });
  }

  // --- Tile activation ----------------------------------------------------
  document.querySelectorAll("[data-media-index]").forEach((tile) => {
    tile.addEventListener("click", () => {
      show(Number(tile.dataset.mediaIndex));
      openDialog(dialog, tile);
    });
  });

  // --- Paging -------------------------------------------------------------
  prevButton.addEventListener("click", () => show(index - 1));
  nextButton.addEventListener("click", () => show(index + 1));

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    }
  });

  // --- Swipe --------------------------------------------------------------
  let startX = 0;
  let startY = 0;

  mediaSlot.addEventListener(
    "touchstart",
    (event) => {
      startX = event.changedTouches[0].screenX;
      startY = event.changedTouches[0].screenY;
    },
    { passive: true }
  );

  mediaSlot.addEventListener(
    "touchend",
    (event) => {
      const dx = event.changedTouches[0].screenX - startX;
      const dy = event.changedTouches[0].screenY - startY;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;

      const item = items[index];
      // Inside a carousel, a swipe moves between slides before it moves
      // between gallery items.
      if (item.type === "instagram-carousel" && Array.isArray(item.slides)) {
        const count = item.slides.length;
        const nextSlide = dx > 0 ? slide - 1 : slide + 1;
        if (nextSlide >= 0 && nextSlide < count) {
          slide = nextSlide;
          renderMedia(item);
          return;
        }
      }
      show(dx > 0 ? index - 1 : index + 1);
    },
    { passive: true }
  );

  // Stop playback and release memory when the dialog closes.
  dialog.addEventListener("close", () => {
    mediaSlot.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    });
    mediaSlot.replaceChildren();
  });

  // --- Tile video posters -------------------------------------------------
  // Seek a little way in so the thumbnail is not a black first frame.
  document.querySelectorAll(".media-tile__frame video").forEach((video) => {
    video.addEventListener(
      "loadedmetadata",
      () => {
        if (Number.isFinite(video.duration)) video.currentTime = video.duration * 0.1;
      },
      { once: true }
    );
  });
}
