/**
 * Year baked into the footer at build time. A small inline script replaces it
 * on load so a long-cached page still shows the current year.
 */
export default new Date().getFullYear();
