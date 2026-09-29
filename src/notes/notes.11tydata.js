// Shared settings for every note in src/notes/.
// Name files YYYY-MM-DD-some-slug.md — Eleventy takes the date from the prefix
// and the URL from the rest (/notes/some-slug/).
// `draft: true` shows a note in `npm run dev` but leaves it out of the live build.
const isLiveBuild = process.env.ELEVENTY_RUN_MODE === "build";

module.exports = {
  layout: "layouts/note.njk",
  og_type: "article",
  eleventyComputed: {
    permalink: (data) =>
      data.draft && isLiveBuild ? false : `/notes/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) => Boolean(data.draft && isLiveBuild),
    seo_title: (data) => `${data.title} — Notes — Mikael Viima`,
    meta_description: (data) =>
      data.summary ||
      `A note by Mikael Viima: ${data.title}${/[.!?]$/.test(data.title) ? "" : "."}`,
    structured_data: (data) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      datePublished: new Date(data.page.date).toISOString().split("T")[0],
      author: { "@type": "Person", name: "Mikael Viima" },
      inLanguage: data.lang || "en",
    }),
  },
};
