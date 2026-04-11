/**
 * Тест-сьют: бронирование билетов в «ИдёмВКино».
 * Паттерн: Given–When–Then в комментариях; шаги вынесены в lib/cinema.js (DRY).
 */
const {
  openMainPage,
  clickSeanceForMovie,
  waitForSeatSelectionPage,
  selectSeats,
  submitBooking,
  waitForBookingConfirmation,
  expectBookButtonDisabled,
} = require("./lib/cinema");

describe("ИдёмВКино — бронирование билетов", () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  test(
    "Happy path: бронь одного места на «Сталкер», сеанс 13:00",
    async () => {
      // Given: открыта афиша
      await openMainPage(page);
      // When: выбран сеанс и одно место, отправлена бронь
      await clickSeanceForMovie(page, "Сталкер", "13:00");
      await waitForSeatSelectionPage(page);
      await selectSeats(page, [{ row: 1, seat: 1 }]);
      await submitBooking(page);
      // Then: показано подтверждение выбора билетов / страница оплаты
      await waitForBookingConfirmation(page);
      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).toMatch(/Вы выбрали билеты|билет/i);
    },
    90_000
  );

  test(
    "Happy path: несколько мест на «Достать ножи», сеанс 15:30",
    async () => {
      // Given
      await openMainPage(page);
      // When
      await clickSeanceForMovie(page, "Достать ножи", "15:30");
      await waitForSeatSelectionPage(page);
      await selectSeats(page, [
        { row: 1, seat: 1 },
        { row: 1, seat: 2 },
        { row: 1, seat: 3 },
      ]);
      await submitBooking(page);
      // Then
      await waitForBookingConfirmation(page);
      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).toMatch(/Вы выбрали билеты|билет/i);
    },
    90_000
  );

  test(
    "Sad path: без выбранных мест кнопка «Забронировать» недоступна",
    async () => {
      // Given: пользователь на экране зала
      await openMainPage(page);
      await clickSeanceForMovie(page, "Ведьмак", "17:00");
      await waitForSeatSelectionPage(page);
      // When: места не выбирались
      // Then: кнопка остаётся disabled (нельзя отправить пустую бронь)
      await expectBookButtonDisabled(page);
    },
    90_000
  );
});
