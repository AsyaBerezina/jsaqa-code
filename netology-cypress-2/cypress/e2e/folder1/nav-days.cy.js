const selectors = require("../../fixtures/selectors.json");

describe("Навигация по дням", () => {
  it("показывает 7 дней в навигации", () => {
    const { main } = selectors.client;
    cy.visit("/client/index.php");
    cy.get(main.pageNavDay).should("have.length", 7);
  });
});

