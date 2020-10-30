import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';

//App
import './App.scss';

//State
import { FirebaseContext } from './app/state/firebaseContext';
import { AudioContext } from './app/state/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import { setMenuIsOpen } from './app/state/menuSlice';
import { selectAudioSettings } from './app/state/audioSlice';

//Routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Components
import { Menu } from './components/Menu/Menu';
import { MenuButton } from './components/MenuButton/MenuButton';
import { Transition } from './components/Transition/Transition';
import { Footer } from './components/Footer/Footer';

//Utilities
import { prepareAudioForPlayback, initializeApp } from './app/init';

//types
import { UtilityConfig } from './app/types';

//Pages
import { Loading } from './views/Loading/Loading';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
const Home = lazy(() => import('./views/Home/Home'));
const About = lazy(() => import('./views/About/About'));
const Contact = lazy(() => import('./views/Contact/Contact'));

export default function App() {
	const audioState = useSelector(selectAudioSettings);
	const { analytics } = useContext(FirebaseContext);
	const dispatch = useDispatch();

	const closeMenu = () => {
		dispatch(setMenuIsOpen(false));
	};

	const [textAudio, setTextAudio] = useState(new Audio()); //Audio from ESV
	const [userAudio, setUserAudio] = useState(new Audio()); //User-recorded Audio
	const audio = {
		textAudio,
		setTextAudio,
		userAudio,
		setUserAudio,
	};

	const utilityConfig: UtilityConfig = {
		textAudio,
		setTextAudio,
		dispatch,
		analytics,
	};

	useEffect(() => {
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
							<MenuButton />
							<Menu />
							<div onClick={closeMenu}>
								<Switch>
									<Route exact path='/contact'>
										<ErrorBoundary>
											<Suspense fallback={Loading()}>
												<Contact />
											</Suspense>
										</ErrorBoundary>
									</Route>
									<Route exact path='/about'>
										<ErrorBoundary>
											<Suspense fallback={Loading()}>
												<About />
											</Suspense>
										</ErrorBoundary>
									</Route>
									<Route path='/'>
										<ErrorBoundary>
											<Suspense fallback={Loading()}>
												<Home />
											</Suspense>
										</ErrorBoundary>
									</Route>
								</Switch>
							</div>
						</Router>
						<Footer />
					</Transition>
				</AudioContext.Provider>
			</ErrorBoundary>
		</div>
	);
}
