/* eslint-disable no-undef */
describe('Repositories E2E', () => {
  it(`should return a list of at most five repositories on
        the first load`, () => {
    cy.visit('/');
    cy.get('[data-test=repository]')
      .its('length')
      .should('not.be.gt', 5);
  });

  it(`should load more repositories after clicking on
      the more button`, () => {
    cy.visit('/');
    cy.contains('More Repositories').click();
    cy.get('[data-test=repository]').should('have.length.gt', 5);
  });
});
