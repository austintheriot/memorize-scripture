import { Genesis3 } from 'app/testChapters';

describe('E2E Tests', () => {
	describe('App', () => {
		it('Should successfully load', () => {
			cy.visit('/');
		});
	});

	describe('ESV API', () => {
		it('Should load a passage via the ESV API', () => {
			cy.server({
				delay: 100,
			});

			cy.route({
				method: 'GET',
				url: 'https://api.esv.org/v3/passage/text/*',
				response: {
					passages: [Genesis3],
				},
			});

			cy.visit('/');

			//Initialize with Psalm 23 from file
			cy.get('h2').should('have.text', 'Psalm 23');
			cy.get('[data-testid=text-original]').should(
				'contain.text',
				'A Psalm of David.'
			);

			//No loading screen initially
			cy.get('[data-testid=text-loading]').should('not.exist');

			//Select the book of Genesis
			cy.get('[data-testid=select-book]').click();
			cy.contains('Genesis').click();

			//Select chapter 3
			cy.get('[data-testid=select-chapter]').click();
			cy.get('[data-testid=3]').scrollIntoView().click();

			//User clicks search button (searching Genesis 3)
			cy.get('[data-testid=search]').click();

			//State is updated, loading screen appears
			cy.get('[data-testid=text-loading]');

			//Psalm 23 disappears
			cy.contains('Psalm 23').should('not.exist');

			//Genesis 3 appears after API fetch
			cy.contains('Genesis 3');
			cy.contains('Now the serpent was more crafty');

			//loading screen has disappeared
			cy.get('[data-testid=text-loading]').should('not.exist');
		});

		it('Should show error message if API call fails (API error)', () => {
			cy.server({
				delay: 100,
			});

			cy.route({
				method: 'GET',
				url: 'https://api.esv.org/v3/passage/text/*',
				status: 500,
				response: {
					passages: null,
				},
			});

			///Select the book of Ephesians
			cy.get('[data-testid=select-book]').click();
			cy.contains('Ephesians').click();

			//Select chapter 6
			cy.get('[data-testid=select-chapter]').click();
			cy.get('[data-testid=6]').scrollIntoView().click();

			//User clicks search button (searching for Psalm 23)
			cy.get('[data-testid=search]').click();

			//Psalm 23 should disappear
			cy.contains('Psalm 23').should('not.exist');

			//Error message appears when API call fails
			cy.contains('Sorry, there was an error loading this passage.');
		});
	});

	describe('Condense Functions', () => {});

	describe('Recent Passages', () => {});
});
