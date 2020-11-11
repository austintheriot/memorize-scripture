import React from 'react';
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
			const title = screen.getByRole('heading', { name: /Learn/i });
			expect(title).toHaveTextContent('Learn');
		});

		test('Should render a search button', async () => {
			render(<MockedLearn />);
			const search = screen.getByRole('button', { name: /search/i });
			expect(search).toBeInTheDocument();
		});
	});

	describe('ESV API Call', () => {
		test('Should show loading screen, then passage', async () => {
			render(<MockedLearn />);

			//Initialized with Psalm 23 from file
			let Psalm23 = screen.getByText(/A Psalm of David/i);
			expect(Psalm23).toBeInTheDocument();
			//No loading screen initially
			let loadingScreen = screen.queryByTestId('text-loading');
			expect(loadingScreen).toBeNull();

			//User clicks search button (searching for Psalm 23)
			const search = screen.getByRole('button', { name: /search/i });
			userEvent.click(search);

			//State is updated, loading screen appears
			//Psalm 23 disappears
			loadingScreen = await screen.getByTestId('text-loading');
			Psalm23 = screen.queryByText(/A Psalm of David/i);
			expect(loadingScreen).toBeInTheDocument();
			expect(Psalm23).toBeNull();

			//Psalm 23 appears after API fetch
			Psalm23 = await waitForElement(() =>
				screen.getByText(/A Psalm of David/i)
			);
			expect(Psalm23).toBeInTheDocument();

			//loading screen disappears
			loadingScreen = screen.queryByTestId('text-loading');
			expect(loadingScreen).toBeNull();
		});
	});
});
