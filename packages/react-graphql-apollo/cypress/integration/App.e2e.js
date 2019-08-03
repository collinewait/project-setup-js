/* eslint-disable no-undef */
describe('App E2E', () => {
  context('Navigation', () => {
    it('should contain a profile link', () => {
      cy.visit('/');
      cy.get('[data-test=profile-link]')
        .should('have.text', 'Profile')
        .and('have.css', 'text-transform', 'uppercase');
    });

    it('should contain an organization link', () => {
      cy.visit('/');
      cy.get('[data-test=organization-link]')
        .should('have.text', 'Organization')
        .and('have.css', 'text-transform', 'uppercase');
    });

    it('should have a url of /profile when the profile link is clicked', () => {
      cy.visit('/');
      cy.get('[data-test=profile-link]').click();
      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/profile');
      });
    });

    it(`should have a url of / when the organization link is clicked
        while at the profile section`, () => {
      cy.visit('/profile');
      cy.get('[data-test=organization-link]').click();
      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/');
      });
    });
  });

  context('Search', () => {
    it(`should contain the-road-to-learn-react as
          the default search term`, () => {
      cy.visit('/');
      cy.get('[data-test=navigation-input]').and(
        'have.value',
        'the-road-to-learn-react',
      );
    });

    it('should not appear under profiles', () => {
      cy.visit('/profile');
      cy.get('[data-test=navigation-input]').should('not.exist');
    });

    it('should search by a different search team', () => {
      cy.visit('/');
      cy.get('[data-test=navigation-input]')
        .clear()
        .type('facebook');
      cy.get('[data-test=search-button]').click();

      cy.get('[data-test=owner]')
        .first()
        .should('have.text', 'facebook');
    });
  });
});
