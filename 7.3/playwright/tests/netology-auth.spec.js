const { test, expect } = require("@playwright/test");
const { USER_EMAIL, USER_PASSWORD } = require("../user.js");

async function openEmailLoginForm(page) {
  await page.goto("https://netology.ru/?modal=sign_in");
  await page.getByRole("button", { name: "ОК" }).click({ timeout: 5000 }).catch(() => {});
  await page.getByText("Войти по почте").click();
  await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
}

test.describe("Авторизация на netology.ru", () => {
  test.beforeEach(async ({ page }) => {
    await openEmailLoginForm(page);
  });

  test("Успешная авторизация", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).fill(USER_EMAIL);
    await page.getByRole("textbox", { name: "Пароль" }).fill(USER_PASSWORD);
    await page.getByTestId("login-submit-btn").click();

    await expect(page).toHaveURL(/netology\.ru/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Моё обучение" })
    ).toBeVisible({ timeout: 30_000 });
  });

  test("Неуспешная авторизация", async ({ page }) => {
    await page
      .getByRole("textbox", { name: "Email" })
      .fill("invalid_user_12345@example.com");
    await page.getByRole("textbox", { name: "Пароль" }).fill("InvalidPassword!999");
    await page.getByTestId("login-submit-btn").click();
    await expect(page.getByText("Вы ввели неправильно логин или пароль")).toBeVisible();
  });
});
