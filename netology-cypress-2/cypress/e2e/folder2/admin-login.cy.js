const selectors = require("../../fixtures/selectors.json");
const adminLogin = require("../../fixtures/admin-login.json");

describe("Авторизация в админке", () => {
  beforeEach(() => {
    cy.visit("/admin/login.html");
  });

  it("happy path: успешный вход под валидными учётными данными", () => {
    const data = adminLogin.happy;
    const { login } = selectors.admin;
    cy.get(login.form).should("be.visible");
    cy.loginAdmin(data.email, data.password);
    cy.url({ timeout: 15000 }).should("include", data.expectedPathIncludes);
    cy.get(selectors.admin.hallControl.managementHeading, { timeout: 20000 })
      .should("be.visible")
      .and("contain", data.expectedHeading);
  });

  it("sad path: сообщение об ошибке при неверном пароле", () => {
    const data = adminLogin.sad;
    cy.submitAdminLoginForm(data.email, data.password);
    cy.contains(data.expectedErrorText).should("be.visible");
  });
});

