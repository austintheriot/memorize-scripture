import React from 'react';
import { render, screen } from '@testing-library/react';
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
	test('Should render without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<MockedLearn />, div);
	});

	test('Should have title Learn', () => {
		render(<MockedLearn />);
		const title = screen.getByRole('heading', { name: /Learn/i });
		expect(title).toHaveTextContent('Learn');
	});
});
