const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const {
  openMainPage,
  clickSeanceForMovie,
  waitForSeatSelectionPage,
  selectSeats,
  submitBooking,
  waitForBookingConfirmation,
  expectBookButtonDisabled,
} = require("../../lib/cinema.js");

Given("открыта главная страница афиши кинотеатра", async function () {
  await openMainPage(this.page);
});

When(
  "пользователь выбирает фильм {string} и сеанс {string}",
  async function (moviePart, time) {
    await clickSeanceForMovie(this.page, moviePart, time);
    await waitForSeatSelectionPage(this.page);
  }
);

When("выбирает места в зале:", async function (dataTable) {
  const seats = dataTable.hashes().map((row) => ({
    row: parseInt(row.ряд, 10),
    seat: parseInt(row.место, 10),
  }));
  await selectSeats(this.page, seats);
});

When("подтверждает бронирование", async function () {
  await submitBooking(this.page);
});

Then("отображается подтверждение выбора билетов", async function () {
  await waitForBookingConfirmation(this.page);
  const bodyText = await this.page.evaluate(() => document.body.innerText);
  expect(bodyText).to.match(/Вы выбрали билеты|билет/i);
});

Then(
  "кнопка подтверждения брони неактивна без выбора мест",
  async function () {
    await expectBookButtonDisabled(this.page);
  }
);
