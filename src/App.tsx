import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';

import * as serviceWorker from './serviceWorker';

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
import { Message } from './components/Message/Message';

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

	const [textAudio, setTextAudio] = useState(
		new Audio(`https://audio.esv.org/hw/mq/Psalm23.mp3`)
	); //Audio from ESV
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
		serviceWorker.register();
		initializeApp(utilityConfig);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		prepareAudioForPlayback(textAudio, audioState, utilityConfig);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [textAudio]);

	const [hideMessage, setHideMessage] = useState(false);

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
									<Message
										message={
											'Long message example.... lorem ipsum dolor sit amet. Long message example.... lorem ipsum dolor sit amet. Long message example.... lorem ipsum dolor sit amet.'
										}
										hide={hideMessage}
										handleHide={() => setHideMessage(true)}
									/>
									<Message
										message={'Example'}
										hide={hideMessage}
										handleHide={() => setHideMessage(true)}
									/>
									<Message
										message={'Example'}
										hide={hideMessage}
										handleHide={() => setHideMessage(true)}
									/>
									<button
										onClick={() => setHideMessage((prevState) => !prevState)}>
										Show/Hide
									</button>
									<Switch>
										<Route exact path='/contact' component={Contact} />
										<Route exact path='/about' component={About} />
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
