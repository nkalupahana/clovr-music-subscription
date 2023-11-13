describe("My First Test", () => {
  it("Visits the Home Page", () => {
    cy.visit("localhost:3000");

    cy.contains("h1", "Welcome to ");
  });

  it("Visits the About Page", () => {
    cy.visit("localhost:3000");

    cy.contains("a", "About").click();

    cy.contains("h1", "About");
  });

  it("Visits the Pricing Page", () => {
    cy.visit("localhost:3000");

    cy.contains("a", "Pricing").click();

    cy.contains("h1", "Pricing");
  });
});
