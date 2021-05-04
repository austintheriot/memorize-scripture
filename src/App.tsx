import React, { useEffect, lazy, Suspense } from 'react';
import * as serviceWorker from './serviceWorker';
import './App.scss';
import { useDispatch } from 'react-redux';
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
import { conditionalStyles } from 'utils/conditionalStyles';
import styles from './Themes.module.scss';
import { ThemeProvider } from 'hooks/useTheme';
import { useTheme } from 'hooks/useTheme';

const Memorize = lazy(() => import('./pages/Memorize/Memorize'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Tools = lazy(() => import('./pages/Tools/Tools'));

function App() {
	useRouteAnalytics();
	const { url, audioRef } = useAudio();
	const dispatch = useDispatch();
	const location = useLocation();
	const { theme } = useTheme();
	
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	useEffect(() => {
		serviceWorker.unregister();
		initializeApp(dispatch);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			className={conditionalStyles([
				styles.ThemeGeneral,
				[styles.ThemeDark, theme === 'dark'],
				[styles.ThemeLight, theme === 'light'],
				'App',
			])}
		>
			<ErrorBoundary>
				<Transition>
					<Suspense fallback={Loading()}>
						<MenuButton />
						<Menu />
						<audio src={url} ref={audioRef} />
							<ServiceWorkerMessages />
							<Switch>
								<Route exact path="/memorize" component={Memorize} />
								<Route exact path="/tools" component={Tools} />
								<Route exact path="/about" component={About} />
								<Route exact path="/contact" component={Contact} />
								<Route path="/" component={Memorize} />
							</Switch>
					</Suspense>
				</Transition>
			</ErrorBoundary>
		</div>
	);
}

const AppWithContext = () => {
	return (
		<ErrorBoundary>
			<ThemeProvider>
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
			</ThemeProvider>
		</ErrorBoundary>
	);
};

export { AppWithContext as default };
