import React from 'react';
import { render, screen } from 'utils/testUtils';
import { MostRecent } from './MostRecent';

describe('<MostRecent/>', () => {
	test('Should render without crashing', () => {
		render(<MostRecent />);
	});

	test('Should be initially closed', () => {
		render(<MostRecent />);
		const mostRecentDetails = screen.getByTestId('most-recent-details');
		expect(mostRecentDetails).not.toHaveAttribute('open');
	});
});
