import { storePlaySpeed } from 'app/storage';
import React, { KeyboardEvent, useCallback, useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
//State
import {
	canPlayEvent,
	pauseEvent,
	playEvent,
	errorEvent,
	playingEvent,
	timeupdateEvent,
	ratechangeEvent,
	spacebarPressed,
	playButtonClicked,
	pauseButtonClicked,
	leftArrowPressed,
	rightArrowPressed,
	progressBarClicked,
	speedButtonClicked,
} from 'store/audioSlice';
import { useAppSelector } from 'store/store';
import { useFirebaseContext } from './useFirebaseContext';
const psalm23 = require('audio/Psalm23.mp3');

interface AudioContextType {
	audio: HTMLAudioElement,
	togglePlayPause: () => void,
	play: () => void,
	pause: () => void,
	rewind: () => void,
	forward: () => void,
	beginning: () => void,
	position: (targetTime: number) => void,
	speed: (targetSpeed: number) => void,
	handleKeyPress: (e: KeyboardEvent<HTMLDivElement>) => void,
}


// audio context value when no provider given
export const AudioContext = React.createContext<AudioContextType>({
	audio: new Audio(psalm23),
	togglePlayPause: () => { },
	play: () => { },
	pause: () => { },
	rewind: () => { },
	forward: () => { },
	beginning: () => { },
	position: () => { },
	speed: () => { },
	handleKeyPress: () => { },
});

export const AudioProvider = ({ children }: { children: any }) => {
	const dispatch = useDispatch();
	const audioSpeed = useAppSelector((state) => state.audio.speed);
	const { analytics } = useFirebaseContext();
	const audioRef = useRef(new Audio(psalm23));
	const textAudio = audioRef.current;

	const prepareAudioForPlayback = useCallback(() => {
		textAudio.load(); //(necessary on mobile
		textAudio.pause();
		textAudio.currentTime = 0;
		textAudio.playbackRate = audioSpeed; //load textAudio settings

		//loaded enough to play
		textAudio.addEventListener('canplay', () => {
			dispatch(canPlayEvent());
		});
		textAudio.addEventListener('pause', () => {
			dispatch(pauseEvent());
		});
		textAudio.addEventListener('play', () => {
			dispatch(playEvent());
		});
		textAudio.addEventListener('error', () => {
			dispatch(errorEvent());
		});
		//not enough data
		textAudio.addEventListener('waiting', () => {
			//No action currently selected for this event
		});
		//ready to play after waiting
		textAudio.addEventListener('playing', () => {
			dispatch(playingEvent());
		});
		//textAudio is over
		textAudio.addEventListener('ended', () => {
			textAudio.pause();
			textAudio.currentTime = 0;
		});
		//as time is updated
		textAudio.addEventListener('timeupdate', () => {
			const targetPosition = textAudio.currentTime / textAudio.duration;
			dispatch(timeupdateEvent(targetPosition));
		});
		//when speed is changed
		textAudio.addEventListener('ratechange', () => {
			dispatch(ratechangeEvent(textAudio.playbackRate));
		});
	}, [audioSpeed, textAudio, dispatch]);

	/**
	 * Plays audio if audio is paused.
	 * Pauses audio if audio is playing.
	 */
	const togglePlayPause = useCallback(() => {
		if (textAudio.readyState < 2) return;
		if (textAudio.paused) {
			textAudio.play();
		} else {
			textAudio.pause();
		}
		dispatch(spacebarPressed());
	}, [textAudio, dispatch]);

	/**
	 * Plays audio if audio is ready to be interacted with.
	 */
	const play = useCallback(() => {
		if (textAudio.readyState < 2) return;
		textAudio.play();
		dispatch(playButtonClicked());
	}, [textAudio, dispatch]);

	/**
	 * Pauses audio if audio is ready to be interacted with.
	 */
	const pause = useCallback(() => {
		if (textAudio.readyState < 2) return;
		textAudio.pause();
		dispatch(pauseButtonClicked());
	}, [textAudio, dispatch]);

	/**
	 * Rewinds audio if audio is ready to be interacted with.
	 */
	const rewind = useCallback(() => {
		if (textAudio.readyState < 2) return;
		const targetTime = Math.max(textAudio.currentTime - 5, 0);
		dispatch(leftArrowPressed(targetTime / textAudio.duration));
		textAudio.currentTime = targetTime;
	}, [textAudio, dispatch]);

	/**
	 * Moves audio forward if audio is ready to be interacted with.
	 */
	const forward = useCallback(() => {
		if (textAudio.readyState < 2) return;
		const targetTime = Math.min(
			textAudio.currentTime + 5,
			textAudio.duration - 0.01
		);
		dispatch(rightArrowPressed(targetTime / textAudio.duration));
		textAudio.currentTime = targetTime;
	}, [textAudio, dispatch]);

	/**
	 * Sends current position of audio to the beginning.
	 */
	const beginning = useCallback(() => {
		if (textAudio.readyState < 2) return;
		textAudio.currentTime = 0;
	}, [textAudio]);

	/**
	 * Moves current audio position to a designated time between 0 and 1
	 * if audio is ready to be interacted with.
	 */
	const position = useCallback((targetTime: number) => {
		if (textAudio.readyState < 2) return;
		dispatch(progressBarClicked(targetTime));
		textAudio.currentTime = textAudio.duration * targetTime;
	}, [textAudio.currentTime, textAudio.duration, textAudio.readyState, dispatch]);

	/**
	 * Changes the current audio speed to the designated speed if audio 
	 * is ready to be interacted with.
	 */
	const speed = useCallback((targetSpeed: number) => {
		if (textAudio.readyState < 2) return;
		textAudio.playbackRate = targetSpeed;
		dispatch(speedButtonClicked(targetSpeed));
		storePlaySpeed(targetSpeed);
	}, [textAudio.playbackRate, textAudio.readyState, dispatch]);

	/**
	 * Enables toggling the audio on/off and rewinding/fast-forwarding
	 * via keyboard navigation if audio is ready to be interacted with.
	 */
	const handleKeyPress = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
		const key = e.key;
		if (textAudio.readyState < 2) return;
		if (key === ' ') {
			e.preventDefault();
			analytics.logEvent('space_bar_pressed');
			togglePlayPause();
		}
		if (key === 'ArrowLeft') {
			analytics.logEvent('left_arrow_pressed');
			rewind();
		}
		if (key === 'ArrowRight') {
			analytics.logEvent('right_arrow_pressed');
			forward();
		}
	}, [analytics, forward, rewind, textAudio.readyState, togglePlayPause])


	useEffect(() => {
		prepareAudioForPlayback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<AudioContext.Provider value={{
			audio: audioRef.current,
			togglePlayPause,
			play,
			pause,
			rewind,
			forward,
			beginning,
			position,
			speed,
			handleKeyPress,
		}}>{children}</AudioContext.Provider>
	);
};

export const useAudioContext = () => {
	return useContext(AudioContext);
};
