describe("HTTP smoke", () => {
  it("главная клиента отвечает 200", () => {
    cy.request("/client/index.php").its("status").should("eq", 200);
  });
});

