import React from 'react';
import mockAxios from 'axios';
import { render, screen, waitForElement } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import Learn from './Learn';

describe('<Learn/>', () => {
	describe('Inner Components', () => {
		test('Should render without crashing', () => {
			render(<Learn />);
		});

		test('Should have title Learn', () => {
			render(<Learn />);
			expect(
				screen.getByRole('heading', { name: /Learn/ })
			).toBeInTheDocument();
		});

		test('Should render Psalm 23 title', () => {
			render(<Learn />);
			expect(
				screen.getByRole('heading', { name: /Psalm 23/ })
			).toBeInTheDocument();
		});

		test('Should render a select input called Book', () => {
			render(<Learn />);
			expect(screen.getByLabelText('Book')).toBeInTheDocument();
		});

		test('Should render a select input called Chapter', () => {
			render(<Learn />);
			expect(screen.getByLabelText('Chapter')).toBeInTheDocument();
		});

		test('Should render a button called Search', () => {
			render(<Learn />);
			expect(
				screen.getByRole('button', { name: /search/i })
			).toBeInTheDocument();
		});

		test('Should render a Most Recent <summary> element', () => {
			render(<Learn />);
			expect(screen.getByTestId('most-recent-details')).toBeInTheDocument();
		});

		test('Should render a Most Recent <details> element', () => {
			render(<Learn />);
			expect(screen.getByTestId('most-recent-details')).toBeInTheDocument();
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
			userEvent.click(book);
			let genesis = await screen.getByText(/Genesis/i);
			userEvent.click(genesis);

			//Select chapter 1
			userEvent.click(chapter);
			let chapter1 = await screen.getByText('3');
			userEvent.click(chapter1);

			//User clicks search button (searching for Psalm 23)
			userEvent.click(search);

			// useFetch should be called to get data
			expect(mockAxios.get).toHaveBeenCalled();

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
			userEvent.click(book);
			let ephesians = await screen.getByText(/Ephesians/i);
			userEvent.click(ephesians);

			//Select chapter 6
			userEvent.click(chapter);
			let chapter6 = await screen.getByText('6');

			userEvent.click(chapter6);
			mockAxios.get = jest
				.fn()
				.mockImplementationOnce(() =>
					Promise.reject('This is a fake network error.')
				)
				.mockName('Unsuccessful ESV API call (simulated network error');

			//User clicks search button (searching for Psalm 23)
			userEvent.click(search);

			// useFetch should be called to get data
			expect(mockAxios.get).toHaveBeenCalledTimes(1);

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

			//Select the book of Philippians
			userEvent.click(book);
			let philippians = await screen.getByText(/Philippians/i);
			userEvent.click(philippians);

			//Select chapter 1
			userEvent.click(chapter);
			let chapter1 = await screen.getByText('2');
			userEvent.click(chapter1);

			mockAxios.get = jest
				.fn()
				.mockImplementationOnce(() =>
					Promise.reject('This is a fake API error.')
				)
				.mockName('Unsuccessful ESV API call (simulated API error');

			//User clicks search button (searching for Psalm 23)
			userEvent.click(search);

			// useFetch should be called to get data
			expect(mockAxios.get).toHaveBeenCalledTimes(1);

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
