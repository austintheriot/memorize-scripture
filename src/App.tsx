import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';

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
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
const Learn = lazy(() => import('./views/Learn/Learn'));
const Review = lazy(() => import('./views/Review/Review'));
const Tools = lazy(() => import('./views/Tools/Tools'));
const About = lazy(() => import('./views/About/About'));
const Contact = lazy(() => import('./views/Contact/Contact'));

export default function App() {
	const audioState = useSelector(selectAudioSettings);

	const { analytics } = useContext(FirebaseContext);
	const dispatch = useDispatch();

	const closeMenu = () => {
		dispatch(outsideOfMenuClicked());
	};

	const [textAudio, setTextAudio] = useState(
		new Audio(`https://audio.esv.org/hw/mq/Psalm23.mp3`)
	); //Audio from ESV
	const audio = {
		textAudio,
		setTextAudio,
	};

	const utilityConfig: UtilityConfig = {
		textAudio,
		setTextAudio,
		dispatch,
		analytics,
	};

	useEffect(() => {
		serviceWorker.register();
		initializeApp(utilityConfig);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		prepareAudioForPlayback(textAudio, audioState, utilityConfig);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [textAudio]);

	return (
		<div className='App'>
			<ErrorBoundary>
				<AudioContext.Provider value={audio}>
					<Transition>
						<Router>
							<Suspense fallback={Loading()}>
								<MenuButton />
								<Menu />
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
						</Router>
					</Transition>
				</AudioContext.Provider>
			</ErrorBoundary>
		</div>
	);
}
