const selectors = require("../../fixtures/selectors.json");
const adminLogin = require("../../fixtures/admin-login.json");

describe("Админка: UI smoke", () => {
  it("после логина виден блок «Управление залами»", () => {
    const { happy } = adminLogin;
    cy.loginAdmin(happy.email, happy.password);
    cy.get(selectors.admin.hallControl.section, { timeout: 20000 }).should("be.visible");
  });
});

