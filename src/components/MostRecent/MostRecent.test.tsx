import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { MostRecent } from './MostRecent';

//Redux
import { Provider } from 'react-redux';
import store from '../../app/store';

const MostRecentWrapper = () => {
	return (
		<Provider store={store}>
			<MostRecent />
		</Provider>
	);
};

describe('<MostRecent/>', () => {
	test('Should render without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<MostRecentWrapper />, div);
	});

	test('Should be initially closed', () => {
		render(<MostRecentWrapper />);
		const mostRecentDetails = screen.getByTestId('most-recent-details');
		expect(mostRecentDetails).not.toHaveAttribute('open');
	});
});
