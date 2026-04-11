/**
 * Общий контекст BDD: браузер и страница Puppeteer для всех .feature.
 */
const puppeteer = require("puppeteer");
const {
  Before,
  After,
  setWorldConstructor,
  World,
  setDefaultTimeout,
} = require("@cucumber/cucumber");

setDefaultTimeout(90 * 1000);

class PuppeteerWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.page = null;
  }
}

setWorldConstructor(PuppeteerWorld);

Before(async function () {
  this.browser = await puppeteer.launch({
    headless: process.env.HEADLESS !== "false",
    slowMo: process.env.SLOW_MO ? Number(process.env.SLOW_MO) : 0,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  this.page = await this.browser.newPage();
  await this.page.setDefaultNavigationTimeout(0);
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});
