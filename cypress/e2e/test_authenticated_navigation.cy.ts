describe("Navigate to All Screens Authenticated", () => {
  before(() => {
    cy.login("CloverTest@test.com", "Password1!");
  });

  it("Visits all screens on Authenticated landing", () => {
    cy.contains("h1", "Home");

    cy.get("#Explore").click();

    cy.contains("h1", "Explore");

    
    cy.get("#About").click();

    cy.contains("h1", "About");

    cy.get("#Subscriptions").click();

    cy.contains("h1", "Subscriptions");
  });
});
