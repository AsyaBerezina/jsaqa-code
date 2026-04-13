const selectors = require("../../fixtures/selectors.json");

describe("Главная страница клиента", () => {
  beforeEach(() => {
    cy.visit("/client/index.php");
  });

  it("отображаются заголовок «Идём в кино» и навигация по дням", () => {
    const { main } = selectors.client;
    cy.get(main.pageHeaderTitle).should("be.visible").and("contain", "кино");
    cy.get(main.pageNav).should("be.visible");
    cy.get(main.pageNavDayChosen).should("exist");
  });

  it("отображаются карточки фильмов с названием и постером", () => {
    const { main } = selectors.client;
    cy.get(main.movieSection).should("have.length.at.least", 1);
    cy.get(main.movieTitle).first().should("be.visible").and("not.be.empty");
    cy.get(main.moviePoster).first().should("be.visible");
  });
});

