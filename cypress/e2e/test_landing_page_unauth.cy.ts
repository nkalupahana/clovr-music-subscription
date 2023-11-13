describe("Test Unauth landing", () => {
  it("Visits all screens on Unauthenticated landing", () => {
    cy.visit("localhost:3000");

    cy.contains("Welcome to ");

    cy.contains("a", "Pricing").click();

    cy.contains("h1", "Pricing");

    cy.contains("a", "About").click();

    cy.contains("h1", "About");

    cy.get("#logo").click();

    cy.contains("Welcome to ");

  });

});
