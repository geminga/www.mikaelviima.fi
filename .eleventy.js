const markdownIt = require("markdown-it");
const yaml = require("js-yaml");
const md = markdownIt({ html: false, breaks: false, linkify: false });

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/CNAME");

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
