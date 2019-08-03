/* eslint-disable no-undef */
describe('App E2E', () => {
  it('should have a header', () => {
    cy.visit('/');

    cy.get('h1').should('have.text', 'My Header');
  });
});
