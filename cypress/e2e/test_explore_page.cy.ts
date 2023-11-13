describe("Explore Page Functionality", () => {
  beforeEach(() => {
    cy.login("CloverTest@test.com", "Password1!");
  });

  it("Song Card Appears on Song Start", () => {
    cy.get("#Explore").click();

    cy.contains("h1", "Explore");

    cy.get(`#play-song`).click({ force: true });

    cy.get("#playing-song-card").should("be.visible");
  });

  it("Bottom Music Player Appears on Song Start", () => {
    cy.get("#Explore").click();

    cy.contains("h1", "Explore");

    cy.get(`#play-song`).click({ force: true });

    cy.get("#bottom-music-player").should("be.visible");
  });
});
