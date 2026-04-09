let page;

function useGithubPage(path) {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(`https://github.com${path}`);
  });

  afterEach(async () => {
    if (page) {
      await page.close();
      page = undefined;
    }
  });
}

describe("Github page tests", () => {
  useGithubPage("/team");

  test(
    "The h1 header content",
    async () => {
      const firstLink = await page.$("header div div a");
      await firstLink.click();
      await page.waitForSelector("h1");
      const title2 = await page.title();
      expect(title2).toEqual(
        "GitHub: Where the world builds software · GitHub"
      );
    },
    55_000
  );

  test(
    "The first link attribute",
    async () => {
      const actual = await page.$eval("a", (link) =>
        link.getAttribute("href")
      );
      expect(actual).toEqual("#start-of-content");
    },
    35_000
  );

  test(
    "The page contains Sign in button",
    async () => {
      const btnSelector = ".btn-large-mktg.btn-mktg";
      await page.waitForSelector(btnSelector, {
        visible: true,
      });
      const actual = await page.$eval(btnSelector, (link) => link.textContent);
      expect(actual).toContain("Sign up for free");
    },
    45_000
  );
});

describe("GitHub — заголовки других страниц", () => {
  describe("Страница Pricing", () => {
    useGithubPage("/pricing");

    test(
      "В title отражена страница тарифов",
      async () => {
        const title = await page.title();
        expect(title).toMatch(/pricing/i);
      },
      40_000
    );
  });

  describe("Страница Features", () => {
    useGithubPage("/features");

    test(
      "В title отражены возможности продукта",
      async () => {
        const title = await page.title();
        expect(title).toMatch(/features/i);
      },
      38_000
    );
  });

  describe("Страница Security", () => {
    useGithubPage("/security");

    test(
      "В title отражена тема безопасности",
      async () => {
        const title = await page.title();
        expect(title).toMatch(/security/i);
      },
      42_000
    );
  });
});
