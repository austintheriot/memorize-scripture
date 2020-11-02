import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

//Firebase Config
import { app, analytics, FirebaseContext } from './app/state/firebaseContext';

//Redux
import { Provider } from 'react-redux';
import store from './app/state/store';

const firebaseContext = {
	app,
	analytics,
};

ReactDOM.render(
	<React.StrictMode>
		<FirebaseContext.Provider value={firebaseContext}>
			<Provider store={store}>
				<App />
			</Provider>
		</FirebaseContext.Provider>
	</React.StrictMode>,

	document.getElementById('root')
);
