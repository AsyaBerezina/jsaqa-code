const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { putText, getText } = require("../../lib/commands.js");

Given("user is on {string} page", async function (path) {
  await this.page.goto(`https://netology.ru${path}`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
});

When("user search by {string}", async function (query) {
  await putText(this.page, "input", query);
});

Then("user sees the course suggested {string}", async function (expected) {
  const actual = await getText(this.page, "a[data-name]");
  expect(actual).to.include(expected);
});
