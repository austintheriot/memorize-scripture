import React from 'react';
import App from './App';

import { render } from 'utils/testUtils';

test('renders without crashing', () => {
	render(<App />);
});
