import React, { useState, useEffect, useContext } from 'react';

//App
import './App.scss';

//State
import { FirebaseContext } from './state/firebaseContext';
import { AudioContext } from './state/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import { setMenuIsOpen } from './state/menuSlice';
import { selectAudioSettings } from './state/audioSlice';

//Routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Components
import { Menu } from './components/Menu/Menu';
import { MenuButton } from './components/MenuButton/MenuButton';
import { Transition } from './components/Transition/Transition';
import { Footer } from './components/Footer/Footer';

//Pages
import { Home } from './components/Home/Home';
import { About } from './components/About/About';
import { Contact } from './components/Contact/Contact';

//Utilities
import { initializeAudio, initializeApp } from './utilities/dataUtilities';

//types
import { UtilityConfig } from './utilities/types';

export default function App() {
	const audioSettings = useSelector(selectAudioSettings);
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
		initializeAudio(textAudio, audioSettings, utilityConfig);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [textAudio]);

	return (
		<div className='App'>
			<AudioContext.Provider value={audio}>
				<Transition>
					<Router>
						<MenuButton />
						<Menu />
						<div onClick={closeMenu}>
							<Switch>
								<Route exact path='/contact' component={Contact} />
								<Route exact path='/about' component={About} />
								<Route path='/'>
									<Home />
								</Route>
							</Switch>
						</div>
					</Router>
					<Footer />
				</Transition>
			</AudioContext.Provider>
		</div>
	);
}
