import React from 'react';
import axios from 'axios';
import { render, screen, waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReactDOM from 'react-dom';
import Learn from './Learn';

//Firebase Config
import { app, analytics, FirebaseContext } from '../../app/firebaseContext';

//Redux
import { Provider } from 'react-redux';
import store from '../../app/store';
import { MemoryRouter } from 'react-router-dom';

const firebaseContext = {
	app,
	analytics,
};

jest.mock('axios');

const MockedLearn = () => {
	return (
		<FirebaseContext.Provider value={firebaseContext}>
			<Provider store={store}>
				<MemoryRouter>
					<Learn />
				</MemoryRouter>
			</Provider>
		</FirebaseContext.Provider>
	);
};

describe('Learn', () => {
	describe('Components', () => {
		test('Should render without crashing', () => {
			const div = document.createElement('div');
			ReactDOM.render(<MockedLearn />, div);
		});

		test('Should have title Learn', () => {
			render(<MockedLearn />);
			screen.getByRole('heading', { name: /Learn/ });
		});

		test('Should render Psalm 23 title', () => {
			render(<MockedLearn />);
			screen.getByRole('heading', { name: /Psalm 23/ });
		});

		test('Should render a select input called Book', async () => {
			render(<MockedLearn />);
			screen.getByLabelText('Book');
		});

		test('getByLabelText Book should be the same as getByRole Book', async () => {
			render(<MockedLearn />);
			const book = screen.getByLabelText('Book');
			const bookCopy = screen.getByRole('button', { name: /book/i });
			expect(book).toEqual(bookCopy);
		});

		test('Should render a select input called Chapter', async () => {
			render(<MockedLearn />);
			screen.getByLabelText('Chapter');
		});

		test('getByLabelText Chapter should be the same as getByRole Chapter', async () => {
			render(<MockedLearn />);
			const chapter = screen.getByLabelText('Chapter');
			const chapterCopy = screen.getByRole('button', { name: /chapter/i });
			expect(chapter).toEqual(chapterCopy);
		});

		test('Should render a button called Search', async () => {
			render(<MockedLearn />);
			screen.getByRole('button', { name: /search/i });
		});
	});

	describe('ESV API Call (e2e)', () => {
		test('Should load new passage via the ESV API', async () => {
			render(<MockedLearn />);

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
	});
});
