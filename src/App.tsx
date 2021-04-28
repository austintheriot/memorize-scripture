import React, { useEffect, lazy, Suspense } from 'react';
import * as serviceWorker from './serviceWorker';
import './App.scss';
import { useDispatch } from 'react-redux';
import { outsideOfMenuClicked } from './store/appSlice';
import { Route, Switch } from 'react-router-dom';
import { Menu } from './components/Menu/Menu';
import { MenuButton } from './components/MenuButton/MenuButton';
import { Transition } from './components/Transition/Transition';
import { ServiceWorkerMessages } from './components/ServiceWorkerMessages/ServiceWorkerMessages';
import { initializeApp } from './app/init';
import { Loading } from './components/Loading/Loading';
import { BibleAudioProvider, useBibleAudio } from 'hooks/useBibleAudio';
import { Provider as StoreProvider } from 'react-redux';
import store, { useAppSelector } from './store/store';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';
import { FirebaseProvider } from 'hooks/useFirebaseContext';
import { useRouteAnalytics } from 'hooks/useRouteAnalytics';
import {
	RecordedAudioProvider,
	useRecordedAudio,
} from 'hooks/useRecordedAudio';
import { IsKeyboardUserContextProvider } from 'hooks/useIsKeyboardUser';

const Learn = lazy(() => import('./pages/Learn/Learn'));
const Review = lazy(() => import('./pages/Review/Review'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Tools = lazy(() => import('./pages/Tools/Tools'));

function App() {
	useRouteAnalytics();
	const bibleAudioUrl = useAppSelector((state) => state.bibleAudio.url);
	const { url: recordedAudioUrl, recordedAudioRef } = useRecordedAudio();
	const dispatch = useDispatch();
	const closeMenu = () => dispatch(outsideOfMenuClicked());
	const { bibleAudioRef } = useBibleAudio();

	useEffect(() => {
		serviceWorker.unregister();
		initializeApp(dispatch);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="App">
			<ErrorBoundary>
				<Transition>
					<Suspense fallback={Loading()}>
						<MenuButton />
						<Menu />
						<audio src={bibleAudioUrl} ref={bibleAudioRef} />
						<audio src={recordedAudioUrl} ref={recordedAudioRef} />
						<div onClick={closeMenu}>
							<ServiceWorkerMessages />
							<Switch>
								<Route exact path="/learn" component={Learn} />
								<Route exact path="/review" component={Review} />
								<Route exact path="/tools" component={Tools} />
								<Route exact path="/about" component={About} />
								<Route exact path="/contact" component={Contact} />
								<Route path="/" component={Learn} />
							</Switch>
						</div>
					</Suspense>
				</Transition>
			</ErrorBoundary>
		</div>
	);
}

const AppWithContext = () => {
	return (
		<ErrorBoundary>
			<Router>
				<FirebaseProvider>
					<StoreProvider store={store}>
						<BibleAudioProvider>
							<RecordedAudioProvider>
								<IsKeyboardUserContextProvider>
									<App />
								</IsKeyboardUserContextProvider>
							</RecordedAudioProvider>
						</BibleAudioProvider>
					</StoreProvider>
				</FirebaseProvider>
			</Router>
		</ErrorBoundary>
	);
};

export { AppWithContext as default };
