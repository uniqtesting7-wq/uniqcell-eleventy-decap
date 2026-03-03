const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  // Global data
  eleventyConfig.addGlobalData("siteName", "UNIQ CELL");
  eleventyConfig.addGlobalData("waNumber", "6285755913524");
  eleventyConfig.addGlobalData("siteUrl", "https://uniq-cctv-network.vercel.app");

  // Filters
  eleventyConfig.addFilter("formatRupiah", function(value) {
    return "Rp " + Number(value).toLocaleString("id-ID");
  });

  eleventyConfig.addFilter("slugify", function(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  });

  eleventyConfig.addFilter("categoryLabel", function(cat) {
    const labels = { laptop: "Laptop", cctv: "CCTV", jaringan: "Jaringan" };
    return labels[cat] || cat;
  });

  eleventyConfig.addFilter("categoryIcon", function(cat) {
    const icons = { laptop: "bi-laptop", cctv: "bi-camera-video", jaringan: "bi-router" };
    return icons[cat] || "bi-box";
  });

  eleventyConfig.addFilter("categoryColor", function(cat) {
    const colors = { laptop: "#0b2b40", cctv: "#b91c1c", jaringan: "#0369a1" };
    return colors[cat] || "#0b2b40";
  });

  // Collections
  eleventyConfig.addCollection("products", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/products/*.md").sort((a, b) => {
      return (a.data.order || 99) - (b.data.order || 99);
    });
  });

  eleventyConfig.addCollection("laptops", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/products/*.md")
      .filter(item => item.data.kategori === "laptop");
  });

  eleventyConfig.addCollection("cctv", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/products/*.md")
      .filter(item => item.data.kategori === "cctv");
  });

  eleventyConfig.addCollection("jaringan", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/products/*.md")
      .filter(item => item.data.kategori === "jaringan");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
