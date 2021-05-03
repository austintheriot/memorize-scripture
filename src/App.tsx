import React, { useEffect, lazy, Suspense } from 'react';
import * as serviceWorker from './serviceWorker';
import './App.scss';
import { useDispatch } from 'react-redux';
import { outsideOfMenuClicked } from './store/appSlice';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Menu } from './components/Menu/Menu';
import { MenuButton } from './components/MenuButton/MenuButton';
import { Transition } from './components/Transition/Transition';
import { ServiceWorkerMessages } from './components/ServiceWorkerMessages/ServiceWorkerMessages';
import { initializeApp } from './app/init';
import { Loading } from './components/Loading/Loading';
import { Provider as StoreProvider } from 'react-redux';
import store from './store/store';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';
import { FirebaseProvider } from 'hooks/useFirebaseContext';
import { useRouteAnalytics } from 'hooks/useRouteAnalytics';
import { IsKeyboardUserContextProvider } from 'hooks/useIsKeyboardUser';
import { AudioProvider, useAudio } from 'hooks/useAudio';

const Memorize = lazy(() => import('./pages/Memorize/Memorize'));
const Review = lazy(() => import('./pages/Review/Review'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Tools = lazy(() => import('./pages/Tools/Tools'));

function App() {
	useRouteAnalytics();
	const { url, audioRef } = useAudio();
	const dispatch = useDispatch();
	const closeMenu = () => dispatch(outsideOfMenuClicked());
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

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
						<audio src={url} ref={audioRef} />
						<div onClick={closeMenu}>
							<ServiceWorkerMessages />
							<Switch>
								<Route exact path="/memorize" component={Memorize} />
								<Route exact path="/review" component={Review} />
								<Route exact path="/tools" component={Tools} />
								<Route exact path="/about" component={About} />
								<Route exact path="/contact" component={Contact} />
								<Route path="/" component={Memorize} />
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
						<AudioProvider>
							<IsKeyboardUserContextProvider>
								<App />
							</IsKeyboardUserContextProvider>
						</AudioProvider>
					</StoreProvider>
				</FirebaseProvider>
			</Router>
		</ErrorBoundary>
	);
};

export { AppWithContext as default };
