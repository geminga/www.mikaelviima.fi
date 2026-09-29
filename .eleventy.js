const markdownIt = require("markdown-it");
const yaml = require("js-yaml");
const md = markdownIt({ html: false, breaks: false, linkify: false });

module.exports = async function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // RSS plugin is ESM-only; only its filters are used — the Notes feed template is our own.
  const { default: rssPlugin } = await import("@11ty/eleventy-plugin-rss");
  eleventyConfig.addPlugin(rssPlugin);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  eleventyConfig.addFilter("md", (value) => {
    if (!value) return "";
    return md.render(value);
  });

  eleventyConfig.addFilter("mdInline", (value) => {
    if (!value) return "";
    return md.renderInline(value);
  });

  eleventyConfig.addFilter("findBySlug", (arr, slug) => {
    return (arr || []).find((item) => item.slug === slug);
  });

  // Notes, newest first. The glob picks up only Markdown notes, not the list page.
  eleventyConfig.addCollection("notes", (api) =>
    api.getFilteredByGlob("src/notes/*.md").reverse()
  );

  eleventyConfig.addFilter("longDate", (value) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
  );

  // "28 July – 1 August 2026" / "28–31 July 2026", for notes with a date_end.
  eleventyConfig.addFilter("dateRange", (start, end) => {
    const fmt = (d, opts) =>
      new Date(d).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
    if (!end) return fmt(start, { day: "numeric", month: "long", year: "numeric" });
    const a = new Date(start);
    const b = new Date(end);
    const sameYear = a.getUTCFullYear() === b.getUTCFullYear();
    const sameMonth = sameYear && a.getUTCMonth() === b.getUTCMonth();
    const tail = fmt(b, { day: "numeric", month: "long", year: "numeric" });
    if (sameMonth) return `${a.getUTCDate()}–${tail}`;
    if (sameYear) return `${fmt(a, { day: "numeric", month: "long" })} – ${tail}`;
    return `${fmt(a, { day: "numeric", month: "long", year: "numeric" })} – ${tail}`;
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    return new Date(value).toISOString().split("T")[0];
  });

  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: false, breaks: false, linkify: false, typographer: true })
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
