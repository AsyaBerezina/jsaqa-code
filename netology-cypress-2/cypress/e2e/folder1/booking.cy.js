const selectors = require("../../fixtures/selectors.json");
const adminLogin = require("../../fixtures/admin-login.json");

describe("Бронирование билета (зал берём из админки)", () => {
  it("находит доступный сеанс и бронирует место", () => {
    const { happy } = adminLogin;
    const { hallControl } = selectors.admin;
    const { seances, hall } = selectors.client;

    cy.loginAdmin(happy.email, happy.password);
    cy.url({ timeout: 15000 }).should("include", happy.expectedPathIncludes);
    cy.get(hallControl.section, { timeout: 20000 }).should("be.visible");

    cy.get(`${hallControl.section} ${hallControl.hallNameButton}`).then(($buttons) => {
      const adminHalls = [...$buttons]
        .map((el) => el.getAttribute("data-hall-name"))
        .filter(Boolean);
      expect(adminHalls.length).to.be.above(0);

      cy.visit("/client/index.php");
      cy.get(seances.hallTitle, { timeout: 20000 }).should("exist");

      cy.pickFirstAvailableSeanceForHall(adminHalls);

      cy.url({ timeout: 15000 }).should("include", "/client/hall.php");
      cy.get("@bookingHallName").then((hallName) => {
        cy.get(hall.hallNameParagraph).should("contain", hallName);
      });
      cy.get(hall.filmTitle).should("be.visible");

      cy.get(hall.freeSeat).first().click();
      cy.get(hall.bookButton).should("not.be.disabled");
      cy.get(hall.bookButton).click();

      cy.url({ timeout: 15000 }).should("include", "/client/payment.php");
    });
  });
});

