import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';

import * as serviceWorker from './serviceWorker';

//App
import './App.scss';

//State
import { FirebaseContext } from './app/firebaseContext';
import { AudioContext } from './app/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import { outsideOfMenuClicked } from './app/appSlice';
import {
	selectAudioSettings,
	spacebarPressed,
	leftArrowPressed,
	rightArrowPressed,
} from './app/audioSlice';

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
const Home = lazy(() => import('./views/Learn/Learn'));
const Review = lazy(() => import('./views/Review/Review'));
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

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const key = e.key;
		console.log(key);
		if (textAudio.readyState !== 4) return;
		if (key === ' ') {
			e.preventDefault();
			analytics.logEvent('space_bar_pressed');
			if (textAudio.paused) {
				textAudio.play();
			} else {
				textAudio.pause();
			}
			dispatch(spacebarPressed());
		}
		if (key === 'ArrowLeft') {
			analytics.logEvent('left_arrow_pressed');
			const targetTime = Math.max(textAudio.currentTime - 5, 0);
			dispatch(leftArrowPressed(targetTime / textAudio.duration));
			textAudio.currentTime = targetTime;
		}
		if (key === 'ArrowRight') {
			analytics.logEvent('right_arrow_pressed');
			const targetTime = Math.min(
				textAudio.currentTime + 5,
				textAudio.duration - 0.01
			);
			dispatch(rightArrowPressed(targetTime / textAudio.duration));
			textAudio.currentTime = targetTime;
		}
	};

	return (
		<div className='App' onKeyDown={handleKeyDown} tabIndex={0}>
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
										<Route exact path='/contact' component={Contact} />
										<Route exact path='/about' component={About} />
										<Route exact path='/review' component={Review} />
										<Route path='/' component={Home} />
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
