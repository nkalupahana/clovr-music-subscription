describe("Test Log in and out", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Login and Logout with mocked Google response", () => {
    cy.get("#google-sign-in").click();

    cy.get('input[name="email"]').type("CloverTest@test.com");
    cy.get('input[name="password"]').type("Password1!");

    cy.contains("button", "Sign in with Credentials").click();

    cy.contains("p", "Signed in as");

    cy.get("#dropdown-trigger").click();

    cy.get("#logout").click();

    cy.contains("h1", "Welcome to CLOVR");
  });
});
