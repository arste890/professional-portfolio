import { build as esbuild } from "esbuild";

/**
 * Bundles the CSS and JS entry points into `_site/assets`.
 *
 * Both source trees use plain `@import` / `import` graphs, which esbuild
 * flattens into one file each, so the browser makes exactly two asset
 * requests no matter how many partials the source is split across.
 *
 * `runMode` comes from Eleventy's own build event ("build" | "serve" |
 * "watch") rather than an environment variable, so a plain `npm run build`
 * minifies without the caller having to set anything.
 */
async function bundleAssets({ runMode } = {}) {
  const production = runMode === "build";

  const shared = {
    bundle: true,
    minify: production,
    sourcemap: production ? false : "inline",
    logLevel: "warning",
  };

  await Promise.all([
    esbuild({
      ...shared,
      entryPoints: ["src/assets/css/main.css"],
      outfile: "_site/assets/css/main.css",
      loader: { ".woff2": "file" },
    }),
    esbuild({
      ...shared,
      entryPoints: ["src/assets/js/main.js"],
      outfile: "_site/assets/js/main.js",
      format: "esm",
      target: ["es2022"],
    }),
  ]);
}

/**
 * Eleventy configuration.
 *
 * Pages are emitted with explicit `.html` permalinks (rather than Eleventy's
 * default `/name/index.html` directory style) so that every public URL stays
 * byte-identical to the pre-migration site. GitHub Pages serves `media.html`
 * at both `/media` and `/media.html`, which is what the existing canonical
 * tags and inbound links already point at.
 */
export default function (eleventyConfig) {
  // Static assets are copied through untouched; the leading `src/` is stripped
  // from the output path automatically.
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/videos");
  eleventyConfig.addPassthroughCopy("src/calculus-and-musical-consonance/thesis.pdf");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");

  // Re-bundle before each build, and re-run on asset edits during --serve.
  eleventyConfig.on("eleventy.before", bundleAssets);
  eleventyConfig.addWatchTarget("src/assets/");

  /** Absolute URL for canonical tags, Open Graph and structured data. */
  eleventyConfig.addFilter("absoluteUrl", (path, base) =>
    new URL(path, base).href
  );

  /** ISO date (YYYY-MM-DD) for <time> elements and the sitemap. */
  eleventyConfig.addFilter("isoDate", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().slice(0, 10);
  });

  /** Escapes a string for safe interpolation into a JSON-LD script block. */
  eleventyConfig.addFilter("jsonify", (value) => JSON.stringify(value, null, 2));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
