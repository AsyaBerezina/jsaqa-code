describe("HTTP smoke (без внешнего Swagger — часто 403)", () => {
  it("главная клиента отвечает 200", () => {
    cy.request("/client/index.php").its("status").should("eq", 200);
  });
});
