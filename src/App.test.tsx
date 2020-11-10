import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//Firebase Config
import { app, analytics, FirebaseContext } from './app/firebaseContext';

//Redux
import { Provider } from 'react-redux';
import store from './app/store';

const firebaseContext = {
	app,
	analytics,
};

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(
		<FirebaseContext.Provider value={firebaseContext}>
			<Provider store={store}>
				<App />
			</Provider>
		</FirebaseContext.Provider>,
		div
	);
});
