/**
 * Кастомные команды для клиента «ИдёмВКино» (https://qamid.tmweb.ru/client/index.php).
 * Селекторы согласованы с /client/js/index.js и /client/js/hall.js.
 */
const { clickElement } = require("./commands");

const CINEMA_MAIN_URL = "https://qamid.tmweb.ru/client/index.php";

/** Открыть главную афишу и дождаться сеансов. */
async function openMainPage(page) {
  await page.goto(CINEMA_MAIN_URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("a.movie-seances__time", { timeout: 20_000 });
}

/**
 * Клик по времени сеанса у фильма, в блоке которого есть указанный фрагмент названия.
 * Берётся первый доступный (не .acceptin-button-disabled) слот с нужным временем.
 */
async function clickSeanceForMovie(page, movieTitlePart, timeLabel) {
  const ok = await page.evaluate(
    (titlePart, time) => {
      const sections = [...document.querySelectorAll("section.movie")];
      const section = sections.find((s) =>
        s.textContent.includes(titlePart)
      );
      if (!section) return false;
      const links = [
        ...section.querySelectorAll("a.movie-seances__time"),
      ];
      const link = links.find(
        (a) =>
          a.textContent.trim() === time &&
          !a.classList.contains("acceptin-button-disabled")
      );
      if (!link) return false;
      link.click();
      return true;
    },
    movieTitlePart,
    timeLabel
  );
  if (!ok) {
    throw new Error(
      `Сеанс не найден или недоступен: «${movieTitlePart}» ${timeLabel}`
    );
  }
}

/** Дождаться экрана выбора мест после выбора сеанса. */
async function waitForSeatSelectionPage(page) {
  await page.waitForSelector(".buying-scheme__wrapper", { timeout: 25_000 });
  await page.waitForSelector(".acceptin-button", { timeout: 10_000 });
}

/**
 * Выбрать места по сетке (как в Cypress-фикстуре): ряд и место — 1-based,
 * дети `.buying-scheme__wrapper` — строки зала.
 */
async function selectSeats(page, seats) {
  for (const { row, seat } of seats) {
    const sel = `.buying-scheme__wrapper > :nth-child(${row}) > :nth-child(${seat})`;
    await page.waitForSelector(sel, { visible: true, timeout: 15_000 });
    await page.click(sel);
  }
}

/** Подтвердить бронь (кнопка активна только при выбранных местах). */
async function submitBooking(page) {
  await clickElement(page, ".acceptin-button:not([disabled])");
}

/** Дождаться страницы оплаты / подтверждения с типовым текстом. */
async function waitForBookingConfirmation(page) {
  await page.waitForFunction(
    () =>
      /payment\.php/.test(window.location.href) ||
      document.body.innerText.includes("Вы выбрали билеты"),
    { timeout: 25_000 }
  );
}

/** Кнопка «Забронировать» заблокирована, пока не выбрано ни одного места. */
async function expectBookButtonDisabled(page) {
  await page.waitForSelector(".acceptin-button[disabled]", { timeout: 10_000 });
  const disabled = await page.$eval(".acceptin-button", (btn) => btn.disabled);
  if (!disabled) {
    throw new Error("Ожидалась неактивная кнопка бронирования без выбранных мест");
  }
}

module.exports = {
  CINEMA_MAIN_URL,
  openMainPage,
  clickSeanceForMovie,
  waitForSeatSelectionPage,
  selectSeats,
  submitBooking,
  waitForBookingConfirmation,
  expectBookButtonDisabled,
};
