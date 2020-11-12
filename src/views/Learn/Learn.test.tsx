import React from 'react';
import axios from 'axios';
import { render, screen, waitForElement } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import Learn from './Learn';

//Redux
import { act } from 'react-dom/test-utils';

jest.mock('axios');

describe('<Learn/>', () => {
	describe('Inner Components', () => {
		test('Should render without crashing', () => {
			render(<Learn />);
		});

		test('Should have title Learn', () => {
			render(<Learn />);
			screen.getByRole('heading', { name: /Learn/ });
		});

		test('Should render Psalm 23 title', () => {
			render(<Learn />);
			screen.getByRole('heading', { name: /Psalm 23/ });
		});

		test('Should render a select input called Book', () => {
			render(<Learn />);
			screen.getByLabelText('Book');
		});

		test('getByLabelText Book should be the same as getByRole Book', () => {
			render(<Learn />);
			const book = screen.getByLabelText('Book');
			const bookCopy = screen.getByRole('button', { name: /book/i });
			expect(book).toEqual(bookCopy);
		});

		test('Should render a select input called Chapter', () => {
			render(<Learn />);
			screen.getByLabelText('Chapter');
		});

		test('getByLabelText Chapter should be the same as getByRole Chapter', () => {
			render(<Learn />);
			const chapter = screen.getByLabelText('Chapter');
			const chapterCopy = screen.getByRole('button', { name: /chapter/i });
			expect(chapter).toEqual(chapterCopy);
		});

		test('Should render a button called Search', () => {
			render(<Learn />);
			screen.getByRole('button', { name: /search/i });
		});

		test('Should render a Most Recent <summary> element', () => {
			render(<Learn />);
			screen.getByTestId('most-recent-details');
		});

		test('Should render a Most Recent <details> element', () => {
			render(<Learn />);
			screen.getByTestId('most-recent-details');
		});
	});

	describe('End-to-End Tests', () => {
		test('Should load new passage via the ESV API', async () => {
			render(<Learn />);

			//Initialized with Psalm 23 from file
			let Psalm23: HTMLElement | null = screen.getByText(/A Psalm of David/i);
			expect(Psalm23).toBeInTheDocument();

			//No loading screen initially
			let loadingScreen = screen.queryByTestId('text-loading');
			expect(loadingScreen).not.toBeInTheDocument();

			const book = screen.getByRole('button', { name: /book/i });
			const chapter = screen.getByRole('button', { name: /chapter/i });
			const search = screen.getByRole('button', { name: /search/i });

			//Select the book of Genesis
			await act(async () => {
				userEvent.click(book);
			});
			let genesis = await screen.getByText(/Genesis/i);
			await act(async () => {
				userEvent.click(genesis);
			});

			//Select chapter 1
			await act(async () => {
				userEvent.click(chapter);
			});
			let chapter1 = await screen.getByText('3');
			await act(async () => {
				userEvent.click(chapter1);
			});

			//User clicks search button (searching for Psalm 23)
			userEvent.click(search);

			// useFetch should be called to get data
			expect(axios.get).toHaveBeenCalled();

			//State is updated, loading screen appears
			loadingScreen = await screen.getByTestId('text-loading');

			//Psalm 23 has already disappeared
			Psalm23 = screen.queryByText(/A Psalm of David/i);
			expect(Psalm23).not.toBeInTheDocument();

			//Genesis 1 appears after API fetch
			const Genesis1 = await waitForElement(() =>
				screen.getByText(/Now the serpent/i)
			);
			expect(Genesis1).toBeInTheDocument();

			//loading screen has disappeared
			loadingScreen = screen.queryByTestId('text-loading');
			expect(loadingScreen).not.toBeInTheDocument();
		});

		test('Should show error message if API call fails (network error)', async () => {
			render(<Learn />);
			const book = screen.getByRole('button', { name: /book/i });
			const chapter = screen.getByRole('button', { name: /chapter/i });
			const search = screen.getByRole('button', { name: /search/i });

			//Select the book of Ephesians
			await act(async () => {
				userEvent.click(book);
			});
			let genesis = await screen.getByText(/Ephesians/i);
			await act(async () => {
				userEvent.click(genesis);
			});

			//Select chapter 6
			await act(async () => {
				userEvent.click(chapter);
			});
			let chapter6 = await screen.getByText('6');
			await act(async () => {
				userEvent.click(chapter6);
			});

			axios.get = jest
				.fn()
				.mockImplementationOnce(() =>
					Promise.reject('This is a fake network error.')
				)
				.mockName('Unsuccessful ESV API call (simulated network error');

			//User clicks search button (searching for Psalm 23)
			await act(async () => {
				userEvent.click(search);
			});

			// useFetch should be called to get data
			expect(axios.get).toHaveBeenCalledTimes(1);

			//Psalm 23 should disappear
			const Psalm23 = screen.queryByText(/A Psalm of David/i);
			expect(Psalm23).not.toBeInTheDocument();

			//Error message appears when API call fails
			const errorMessage = await waitForElement(() =>
				screen.getByText('Sorry, there was an error loading this passage.')
			);
			expect(errorMessage).toBeInTheDocument();
		});

		test('Should show error message when API call fails (API error)', async () => {
			render(<Learn />);
			const book = screen.getByRole('button', { name: /book/i });
			const chapter = screen.getByRole('button', { name: /chapter/i });
			const search = screen.getByRole('button', { name: /search/i });

			//Select the book of Ephesians
			await act(async () => {
				userEvent.click(book);
			});
			let genesis = await screen.getByText(/Philippians/i);
			await act(async () => {
				userEvent.click(genesis);
			});

			//Select chapter 1
			await act(async () => {
				userEvent.click(chapter);
			});
			let chapter1 = await screen.getByText('2');
			await act(async () => {
				userEvent.click(chapter1);
			});

			axios.get = jest
				.fn()
				.mockImplementationOnce(() =>
					Promise.reject('This is a fake API error.')
				)
				.mockName('Unsuccessful ESV API call (simulated API error');

			//User clicks search button (searching for Psalm 23)
			await act(async () => {
				userEvent.click(search);
			});

			// useFetch should be called to get data
			expect(axios.get).toHaveBeenCalledTimes(1);

			//Psalm 23 should disappear
			const Psalm23 = screen.queryByText(/A Psalm of David/i);
			expect(Psalm23).not.toBeInTheDocument();

			//Error message appears when API call fails
			const errorMessage = await waitForElement(() =>
				screen.getByText('Sorry, there was an error loading this passage.')
			);
			expect(errorMessage).toBeInTheDocument();
		});
	});
});
