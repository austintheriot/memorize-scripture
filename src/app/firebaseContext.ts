import React from 'react';

//Firebase Config
import { firebaseConfig } from './config';
import * as firebase from 'firebase/app';
import 'firebase/analytics';

interface Context {
	app: firebase.app.App;
	analytics: firebase.analytics.Analytics;
}

export const app = firebase.initializeApp(firebaseConfig);
export const analytics = firebase.analytics(app);
export const FirebaseContext = React.createContext<Context>({
	app,
	analytics,
});
