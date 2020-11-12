// test-utils.js
import React from 'react';
import { render } from '@testing-library/react';

//Firebase Config
import { app, analytics, FirebaseContext } from '../app/firebaseContext';

//Redux
import { Provider } from 'react-redux';
import store from '../app/store';
import { MemoryRouter } from 'react-router-dom';

const firebaseContext = {
	app,
	analytics,
};

const AllTheProviders = ({ children }: any) => {
	return (
		<FirebaseContext.Provider value={firebaseContext}>
			<Provider store={store}>
				<MemoryRouter>{children}</MemoryRouter>
			</Provider>
		</FirebaseContext.Provider>
	);
};

const customRender = (ui: any, options?: any) =>
	render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
