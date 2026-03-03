module.exports = function(eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  // ── FILTERS ──
  eleventyConfig.addFilter("formatRupiah", function(value) {
    return "Rp " + Number(value).toLocaleString("id-ID");
  });

  eleventyConfig.addFilter("categoryLabel", function(cat) {
    const labels = { laptop: "Laptop", cctv: "CCTV", jaringan: "Jaringan" };
    return labels[cat] || cat;
  });

  eleventyConfig.addFilter("categoryIcon", function(cat) {
    const icons = { laptop: "bi-laptop", cctv: "bi-camera-video", jaringan: "bi-router" };
    return icons[cat] || "bi-box";
  });

  eleventyConfig.addFilter("urlencode", function(str) {
    return encodeURIComponent(String(str));
  });

  eleventyConfig.addFilter("slice", function(arr, limit) {
    return arr ? arr.slice(0, limit) : [];
  });

  eleventyConfig.addFilter("dump", function(val) {
    return JSON.stringify(val);
  });

  // ── COLLECTIONS ──
  eleventyConfig.addCollection("products", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/products/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99));
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
