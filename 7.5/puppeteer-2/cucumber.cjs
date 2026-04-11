/** @type {import("@cucumber/cucumber/lib/configuration/types").IConfiguration} */
module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    import: [
      "features/support/world.js",
      "features/step_definitions/**/*.js",
    ],
  },
};
