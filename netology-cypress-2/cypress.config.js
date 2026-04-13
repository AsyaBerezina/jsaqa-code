const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "f97zei",
  e2e: {
    baseUrl: "http://qamid.tmweb.ru",
    specPattern: "cypress/e2e/**/*.js",
    supportFile: "cypress/support/index.js",
    viewportWidth: 1366,
    viewportHeight: 768,
    video: false,
    // снижает ошибку spawn -86 при очистке артефактов на части macOS
    trashAssetsBeforeRuns: false,
    setupNodeEvents(_on, config) {
      return config;
    },
  },
});
