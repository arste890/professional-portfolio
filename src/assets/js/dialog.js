/**
 * Declarative open/close wiring for static <dialog> elements.
 *
 * Any `[data-dialog-open="<id>"]` button opens the matching dialog, and any
 * `[data-dialog-close]` inside one closes it. Native <dialog>.showModal()
 * supplies the focus trap, the inert background and Escape-to-close that the
 * previous hand-rolled modal lacked.
 */

/** Opens a dialog and restores focus to the opener when it closes. */
export function openDialog(dialog, opener) {
  if (!dialog || dialog.open) return;
  dialog.showModal();
  if (opener) {
    dialog.addEventListener(
      "close",
      () => opener.focus({ preventScroll: true }),
      { once: true }
    );
  }
}

export function initDialogs() {
  document.querySelectorAll("[data-dialog-open]").forEach((opener) => {
    opener.addEventListener("click", () => {
      openDialog(document.getElementById(opener.dataset.dialogOpen), opener);
    });
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      // A click landing on the dialog element itself (rather than its
      // contents) is a click on the backdrop.
      if (event.target === dialog) dialog.close();
    });

    dialog
      .querySelectorAll("[data-dialog-close]")
      .forEach((button) => button.addEventListener("click", () => dialog.close()));
  });
}
