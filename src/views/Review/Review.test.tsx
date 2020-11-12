import React from 'react';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import Review from './Review';
import { Psalm23 } from 'app/Psalm23';
import { Genesis3 } from 'app/testChapters';

beforeEach(() => {
	render(<Review />);
});

describe('<Review/>', () => {
	describe('Components', () => {
		test('Should have Input component', () => {
			expect(screen.getByLabelText(/Input/i)).toBeInTheDocument();
		});
		test('Should have any empty Results component', () => {
			expect(screen.queryByTestId('empty-results')).toBeInTheDocument();
		});
		test('Should not yet have a filled-in Results component', () => {
			expect(screen.queryByTestId('filledin-results')).not.toBeInTheDocument();
		});
		test('Should have Stats component', () => {
			expect(screen.getByText(/Stats/i)).toBeInTheDocument();
		});
	});

	describe('I/O Checks', () => {
		test('Should show placeholder texts when nothing is entered', () => {
			expect(
				screen.getByPlaceholderText('Enter the text of Psalm 23 here')
			).toBeInTheDocument();
			expect(
				screen.getByText('Your corrected text will appear here')
			).toBeInTheDocument();
		});

		describe('Entering some correct example text', () => {
			const enteredText = 'A Psalm of David.';

			beforeEach(() => {
				const input = screen.getByLabelText(/Input/i);
				userEvent.type(input, enteredText);
			});

			test('Should render filled-in Results element after entering text', () => {
				expect(screen.getByTestId('filledin-results')).toBeInTheDocument();
			});

			test('Should show identical I/O text when correct', () => {
				expect(screen.getAllByText(enteredText).length).toBe(2);
				expect(screen.getByTestId('filledin-results')).toHaveTextContent(
					enteredText
				);
			});

			test('Should mark text as correct', () => {
				expect(screen.getAllByText(enteredText)[1]).toHaveClass('correct');
			});

			test('Should grade correctly', () => {
				expect(screen.getByText(/Attempted Correct:/i)).toHaveTextContent(
					'Attempted Correct: 100%'
				);

				expect(screen.getByText(/Total Correct:/i)).toHaveTextContent(
					'Total Correct: 2.9%'
				);
			});
		});

		describe('Entering some incorrect example text', () => {
			const enteredText = 'A Psalm ov David.';

			//Click the input & enter some text
			beforeEach(() => {
				const input = screen.getByLabelText(/Input/i);
				userEvent.type(input, enteredText);
			});

			test('Should mark correct letters as correct', () => {
				expect(screen.getByText('A Psalm o')).toHaveClass('correct');
				expect(screen.getByText('David.')).toHaveClass('correct');
			});

			test('Should mark wrong letters as incorrect', () => {
				expect(screen.getByText('v')).toHaveClass('incorrect');
			});

			test('Should grade correctly', () => {
				expect(screen.getByText(/Attempted Correct:/i)).toHaveTextContent(
					'Attempted Correct: 92.3%'
				);

				expect(screen.getByText(/Total Correct:/i)).toHaveTextContent(
					'Total Correct: 2.7%'
				);
			});
		});

		describe('Entering text with weird capitalization, punctuation, spaces, and line breaks', () => {
			const enteredText = ' a.. .?? p S a\n \nlm      OF\n\n\n daviD!!!!';

			//Click the input & enter some text
			beforeEach(() => {
				const input = screen.getByLabelText(/Input/i);
				userEvent.type(input, enteredText);
			});

			test('Should show identical I/O text when correct', () => {
				expect(screen.getAllByText(/daviD/).length).toBe(2);
				expect(screen.getAllByText(/daviD/)[0].textContent).toBe(
					screen.getAllByText(/daviD/)[1].textContent
				);
			});

			test('Should mark entire text as correct', () => {
				expect(screen.getAllByText(/daviD/)[1]).toHaveClass('correct');
			});
		});

		describe('Should grade correctly when entire text is entered', () => {
			beforeEach(() => {
				const input = screen.getByLabelText(/Input/i);
				userEvent.type(input, Psalm23);
			});

			test('Should mark entire text as correct', () => {
				expect(screen.getAllByText(/A Psalm of David./)[1]).toHaveClass(
					'correct'
				);
			});

			test('Should grade correctly', () => {
				expect(screen.getByText(/Attempted Correct:/i)).toHaveTextContent(
					'Attempted Correct: 100%'
				);

				expect(screen.getByText(/Total Correct:/i)).toHaveTextContent(
					'Total Correct: 100%'
				);
			});
		});

		describe('Entering large, incorrect text', () => {
			beforeEach(() => {
				const input = screen.getByLabelText(/Input/i);
				userEvent.type(input, Genesis3);
			});

			test('Should split the text into many different correct/incorrect chunks', () => {
				expect(
					Array.from(screen.getByTestId('filledin-results').children).length
				).toBeGreaterThan(10);
			});

			test('Should mark most of the chunks as incorrect', () => {
				const children = Array.from(
					screen.getByTestId('filledin-results').children
				);
				let incorrectLength = 0;
				children.forEach((span) => {
					if (span.className.includes('incorrect')) {
						incorrectLength += span.textContent?.length ?? 0;
					}
				});
				expect(incorrectLength / Genesis3.length).toBeGreaterThan(0.5);
			});
		});
	});
});
