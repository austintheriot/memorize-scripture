import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store/store';
import { MemoryRouter } from 'react-router-dom';
import { FirebaseProvider } from "~/hooks/useFirebaseContext";

const AllTheProviders = ({ children }: any) => {
	return (
		<FirebaseProvider>
			<Provider store={store}>
				<MemoryRouter>{children}</MemoryRouter>
			</Provider>
		</FirebaseProvider>
	);
};

const customRender = (ui: any, options?: any) =>
	render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
