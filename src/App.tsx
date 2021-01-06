import React, { useEffect, useContext, lazy, Suspense, useRef } from 'react';

import * as serviceWorker from './serviceWorker';

//App
import './App.scss';

//State
import { FirebaseContext } from './app/firebaseContext';
import { AudioContext } from './app/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import { outsideOfMenuClicked } from './app/appSlice';
import { selectAudioSettings } from './app/audioSlice';

//Routing
import { Route, Switch, useLocation } from 'react-router-dom';

//Components
import { Menu } from './components/Menu/Menu';
import { MenuButton } from './components/MenuButton/MenuButton';
import { Transition } from './components/Transition/Transition';
import { ServiceWorkerMessages } from './components/ServiceWorkerMessages/ServiceWorkerMessages';

//Utilities
import { prepareAudioForPlayback, initializeApp } from './app/init';

//types
import { UtilityConfig } from './app/types';

//Pages
import { Loading } from './components/Loading/Loading';

const Learn = lazy(() => import('./pages/Learn/Learn'));
const Review = lazy(() => import('./pages/Review/Review'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Tools = lazy(() => import('./pages/Tools/Tools'));

export default function App() {
	const audioState = useSelector(selectAudioSettings);

	const { analytics } = useContext(FirebaseContext);
	const dispatch = useDispatch();

	const closeMenu = () => {
		dispatch(outsideOfMenuClicked());
	};

	const audioElement = useRef<HTMLAudioElement>(
		new Audio(require('audio/Psalm23.mp3'))
	);

	const utilityConfig: UtilityConfig = {
		audioElement: audioElement.current,
		dispatch,
		analytics,
	};

	const location = useLocation();

	useEffect(() => {
		analytics.logEvent('page_view', {
			page_path: location.pathname,
			page_location: window.location.href,
		});
	}, [analytics, location]);

	useEffect(() => {
		serviceWorker.register();
		initializeApp(utilityConfig);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		prepareAudioForPlayback(audioElement.current, audioState, utilityConfig);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audioState.url]);

	return (
		<div className='App'>
			<AudioContext.Provider value={audioElement.current}>
				<Transition>
					<Suspense fallback={Loading()}>
						<MenuButton />
						<Menu />
						<audio src={audioState.url} ref={audioElement} />
						<div onClick={closeMenu}>
							<ServiceWorkerMessages />
							<Switch>
								<Route exact path='/learn' component={Learn} />
								<Route exact path='/review' component={Review} />
								<Route exact path='/tools' component={Tools} />
								<Route exact path='/about' component={About} />
								<Route exact path='/contact' component={Contact} />
								<Route path='/' component={Learn} />
							</Switch>
						</div>
					</Suspense>
				</Transition>
			</AudioContext.Provider>
		</div>
	);
}
