describe('Landing Page Load Test', () => {
  it('successfully loads the homepage', () => {
    cy.visit('/'); // Visit the base URL (set via CYPRESS_baseUrl)
    cy.contains('Zombie Survival Network'); // Replace "Welcome" with text expected on your homepage
    cy.url().should('include', '/'); // Verify the URL
  });
});
