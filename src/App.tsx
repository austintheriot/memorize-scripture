import React, { useState, useEffect } from 'react';

//App
import './App.scss';

//State
import { AudioContext } from './state/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import { setMenuIsOpen } from './state/menuSlice';
import {
	setAudioHasError,
	setAudioIsReady,
	setAudioIsPlaying,
	selectAudioSettings,
	setAudioPosition,
	setAudioSpeed,
} from './state/audioSlice';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Custom components
import { Menu } from './components/Menu/Menu';
import { MenuButton } from './components/MenuButton/MenuButton';
import { Transition } from './components/Transition/Transition';
import { Footer } from './components/Footer/Footer';

//Pages
import { Home } from './components/Home/Home';
import { About } from './components/About/About';
import { Contact } from './components/Contact/Contact';

export default function App() {
	const audioSettings = useSelector(selectAudioSettings);
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

	/* textAudio event listeners */
	useEffect(() => {
		//load the resource (necessary on mobile)
		textAudio.load();
		textAudio.currentTime = 0;
		textAudio.playbackRate = audioSettings.speed; //load textAudio settings

		//loaded enough to play
		textAudio.addEventListener('canplay', () => {
			dispatch(setAudioIsReady(true));
		});
		textAudio.addEventListener('pause', () => {
			dispatch(setAudioIsPlaying(false));
		});
		textAudio.addEventListener('play', () => {
			dispatch(setAudioIsPlaying(true));
		});
		textAudio.addEventListener('error', () => {
			dispatch(setAudioHasError(true));
		});
		//not enough data
		textAudio.addEventListener('waiting', () => {
			//No action currently selected for this event
		});
		//ready to play after waiting
		textAudio.addEventListener('playing', () => {
			dispatch(setAudioIsReady(true));
		});
		//textAudio is over
		textAudio.addEventListener('ended', () => {
			textAudio.pause();
			textAudio.currentTime = 0;
		});
		//as time is updated
		textAudio.addEventListener('timeupdate', () => {
			dispatch(setAudioPosition(textAudio.currentTime / textAudio.duration));
		});
		//when speed is changed
		textAudio.addEventListener('ratechange', () => {
			dispatch(setAudioSpeed(textAudio.playbackRate));
		});

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
