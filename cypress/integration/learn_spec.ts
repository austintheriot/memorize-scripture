import { Genesis3 } from 'app/testChapters';

describe('Learn', () => {
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

			cy.visit('/');

			///Select the book of Ephesians
			cy.get('[data-testid=select-book]').click();
			cy.contains('Ephesians').click();

			//Select chapter 6
			cy.get('[data-testid=select-chapter]').click();
			cy.get('[data-testid=6]').scrollIntoView().click();

			//User clicks search button (searching for Psalm 23)
			cy.get('[data-testid=search]').click();

			//Psalm 23 should disappear
			cy.contains('A Psalm of David.').should('not.exist');

			//Error message appears when API call fails
			cy.contains('Sorry, there was an error loading this passage.');
		});
	});

	describe('Audio Controls', () => {
		const checkRelTimeRange = (low: number, high: number) => {
			cy.get('audio').should(($audio) => {
				expect($audio)
					.prop('currentTime')
					.to.be.greaterThan(low * $audio.prop('duration'));
				expect($audio)
					.prop('currentTime')
					.to.be.lessThan(high * $audio.prop('duration'));
			});
		};

		const checkAbsTimeRange = (low: number, high: number) => {
			cy.get('audio').should(($audio) => {
				expect($audio).prop('currentTime').to.be.greaterThan(low);
				expect($audio).prop('currentTime').to.be.lessThan(high);
			});
		};

		const playAudio = () => {
			//Play
			cy.get('[data-testid=play]').as('play').click();
			cy.get('audio').should('have.prop', 'paused', false);
			cy.get('[data-testid=play]').should('not.exist');
			cy.get('[data-testid=pause]').should('exist');
		};

		const fastForwardAudio = (times: number) => {
			for (let i = 0; i < times; i++) {
				cy.get('[data-testid=forward]').click();
			}
		};

		const rewindAudio = (times: number) => {
			for (let i = 0; i < times; i++) {
				cy.get('[data-testid=rewind]').click();
			}
		};

		const cycleThroughAudioSpeeds = () => {
			cy.get('[data-testid=speed]').click();
			cy.get('audio').should('have.prop', 'playbackRate', 1.25);
			cy.get('[data-testid=speed]').click();
			cy.get('audio').should('have.prop', 'playbackRate', 1.5);
			cy.get('[data-testid=speed]').click();
			cy.get('audio').should('have.prop', 'playbackRate', 1.75);
			cy.get('[data-testid=speed]').click();
			cy.get('audio').should('have.prop', 'playbackRate', 2);
			cy.get('[data-testid=speed]').click();
			cy.get('audio').should('have.prop', 'playbackRate', 0.5);
			cy.get('[data-testid=speed]').click();
			cy.get('audio').should('have.prop', 'playbackRate', 0.75);
			cy.get('[data-testid=speed]').click();
			cy.get('audio').should('have.prop', 'playbackRate', 1);
		};

		const pauseAudio = () => {
			cy.get('[data-testid=pause]').as('pause').click();
			cy.get('audio').should('have.prop', 'paused', true);
			cy.get('[data-testid=play]').should('exist');
			cy.get('[data-testid=pause]').should('not.exist');
		};

		const goToBeginning = () => {
			cy.get('[data-testid=beginning]').as('goToBeginning').click();
			cy.get('audio').should(($audio) => {
				expect($audio).prop('currentTime').to.be.lessThan(5);
			});
		};

		it('Should initialize with proper audio settings', () => {
			cy.visit('/');
			cy.get('audio').should(($audio) => {
				expect($audio).to.have.prop('paused', true);
				expect($audio).prop('currentTime').to.equal(0);
				expect($audio).prop('error').to.equal(null);
				expect($audio).prop('playbackRate').to.equal(1);
			});
		});

		it('Should work while audio is playing', () => {
			cy.visit('/');
			playAudio();
			pauseAudio();
			playAudio();
			fastForwardAudio(1);
			checkAbsTimeRange(4.5, 5.5);
			rewindAudio(1);
			checkAbsTimeRange(0, 1);
			fastForwardAudio(6);
			checkRelTimeRange(0.5, 1);
			rewindAudio(4);
			checkRelTimeRange(0, 0.5);
			cycleThroughAudioSpeeds();
			goToBeginning();
		});

		it('Should work while audio is paused', () => {
			cy.visit('/');
			playAudio();
			pauseAudio();
			cycleThroughAudioSpeeds();
			fastForwardAudio(1);
			checkAbsTimeRange(4.5, 5.5);
			rewindAudio(1);
			checkAbsTimeRange(0, 1);
			fastForwardAudio(6);
			checkRelTimeRange(0.5, 1);
			rewindAudio(4);
			checkRelTimeRange(0, 0.5);
			goToBeginning();
		});

		it('Should not allow the audio position to go farther back than 0', () => {
			cy.visit('/');

			//Do not go farther back than goToBeginning
			rewindAudio(3);
			cy.get('audio').should('have.prop', 'currentTime', 0);
		});

		it('Should not allow the audio position to go farther than the end', () => {
			cy.visit('/');
			//Do not fast-fastForwardAudio past the end
			fastForwardAudio(10);
			checkRelTimeRange(0.9, 1);

			//When played at the end, should return to the goToBeginning
			playAudio();
			cy.get('audio').should(($audio) => {
				expect($audio).to.have.prop('paused', true);
				expect($audio).prop('currentTime').to.equal(0);
			});
		});

		it('Should retain playback speed between page reolads', () => {
			cy.visit('/');
			//Playback speed should be retained between page reloads
			cy.get('audio').should('have.prop', 'playbackRate', 1);

			cy.get('[data-testid=speed]').click();
			cy.get('audio')
				.should('have.prop', 'playbackRate')
				.then((previousPlaybackRate) => {
					cy.reload();
					cy.get('audio').should((audio) => {
						expect(audio).prop('playbackRate').to.equal(previousPlaybackRate);
					});
				});
		});

		it('Should pause audio when navigating away from the page', () => {
			cy.visit('/');
			//Navigating away from the page should pause the audio
			playAudio();
			//Navigate to About
			cy.get('[data-testid=menu-button]').click();
			cy.get('[data-testid=about]').click();
			cy.get('audio').should('have.prop', 'paused', true);

			//Go back to Learn
			cy.get('[data-testid=menu-button]').click();
			cy.get('[data-testid=learn]').click();
			playAudio();
			//Navigate to Review
			cy.get('[data-testid=menu-button]').click();
			cy.get('[data-testid=review]').click();
			cy.get('audio').should('have.prop', 'paused', true);

			//Go back to Learn
			cy.get('[data-testid=menu-button]').click();
			cy.get('[data-testid=learn]').click();
			playAudio();
			//Navigate to Tools
			cy.get('[data-testid=menu-button]').click();
			cy.get('[data-testid=tools]').click();
			cy.get('audio').should('have.prop', 'paused', true);

			//Go back to Learn
			cy.get('[data-testid=menu-button]').click();
			cy.get('[data-testid=learn]').click();
			playAudio();
			//Navigate to Contact
			cy.get('[data-testid=menu-button]').click();
			cy.get('[data-testid=contact]').click();
			cy.get('audio').should('have.prop', 'paused', true);
		});
	});

	describe('Condense Functions', () => {});

	describe('Recent Passages', () => {});
});
