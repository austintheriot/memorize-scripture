import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

//Firebase Config
import { app, analytics, FirebaseContext } from './app/firebaseContext';

//Redux
import { Provider } from 'react-redux';
import store from './app/store';

//Routing
import { BrowserRouter as Router } from 'react-router-dom';

import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';

const firebaseContext = {
	app,
	analytics,
};

ReactDOM.render(
	<React.StrictMode>
		<FirebaseContext.Provider value={firebaseContext}>
			<Provider store={store}>
				<Router>
					<ErrorBoundary>
						<App />
					</ErrorBoundary>
				</Router>
			</Provider>
		</FirebaseContext.Provider>
	</React.StrictMode>,

	document.getElementById('root')
);
